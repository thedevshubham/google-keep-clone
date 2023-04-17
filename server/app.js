const { PubSub } = require("graphql-subscriptions");
const { uuid } = require("uuidv4");
const { createServer } = require("http");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const port = 4000;
const pubsub = new PubSub();

const typeDefs = gql`
  type Note {
    id: ID!
    title: String
    content: String
    color: String
    label: [String]
  }

  type Query {
    notes: [Note]
    getLabels: [String]
  }

  type Mutation {
    createNote(
      title: String
      content: String
      color: String
      label: [String]
    ): Note

    updateNote(
      id: ID!
      title: String
      content: String
      color: String
      label: [String]
    ): Note
  }

  type Subscription {
    noteCreated: Note
    noteUpdated: Note
    labelAdded: [String]
  }
`;

const notes = [
  {
    id: "007e3c43-0720-4119-9bc7-57a0ad1155da",
    title: "Shell Scripting",
    color: "#ffffff",
    label: ["label1", "label2"],
    content:
      "Shell scripting is the process of writing and executing commands and scripts using a shell, which is a command-line interface for interacting with an operating system. Shell scripts are typically used for automating tasks, managing system configurations, and performing various administrative tasks.",
    __typename: "Note",
  },
  {
    id: "67b38042-26a9-410d-b619-6c0fbf4d299e",
    title: "Shell Scripting Description",
    color: "#ffffff",
    label: ["label1", "label2"],
    content:
      "No, it is not possible to do shell scripting using JavaScript.\n\nShell scripting is the process of writing and executing commands and scripts using a shell, which is a command-line interface for interacting with an operating system. Shell scripts are typically used for automating tasks, managing system configurations, and performing various administrative tasks.\n\nJavaScript, on the other hand, is a programming language that is primarily used for developing web applications and client-side scripting. It is not designed for interacting with the operating system and does not provide access to the system-level commands and functionality that are required for shell scripting.\n\nThat being said, there are other scripting languages that are specifically designed for shell scripting, such as Bash, Python, and Perl. These languages have built-in support for interacting with the shell and are more suitable for writing shell scripts than JavaScript.",
    __typename: "Note",
  },
];

const labels = ["label1", "label2"];

const resolvers = {
  Query: {
    notes: () => notes,
    getLabels: () => labels,
  },

  Mutation: {
    createNote: (parent, args) => {
      const note = {
        id: uuid(),
        title: args.title,
        content: args.content,
        color: args.color || "#ffffff",
        label: args.label || [],
      };
      notes.push(note);
      pubsub.publish("NOTE_CREATED", { noteCreated: note });
      pubsub.publish("NOTE_UPDATED", { noteUpdated: note });
      return note;
    },

    updateNote: (parent, args) => {
      const note = notes.find((note) => note.id === args.id);
      note.title = args.title || note.title;
      note.content = args.content || note.content;
      note.color = args.color || note.color;
      if (args?.label?.length === 1) {
        note.label.push(args.label[0]);
        if (labels.indexOf(args.label[0]) === -1) {
          labels.push(args.label[0]);
          pubsub.publish("NEW_LABEL_ADDED", { labelAdded: labels });
        }
      }
      pubsub.publish("NOTE_UPDATED", { noteUpdated: note });
      return note;
    },
  },

  Subscription: {
    noteCreated: {
      subscribe: () => pubsub.asyncIterator("NOTE_CREATED"),
      resolve: (payload) => payload.noteCreated,
    },
    noteUpdated: {
      subscribe: () => pubsub.asyncIterator("NOTE_UPDATED"),
      resolve: (payload) => payload.noteUpdated,
    },
    labelAdded: {
      subscribe: () => pubsub.asyncIterator("NEW_LABEL_ADDED"),
      resolve: (payload) => {
        return payload.labelAdded;
      },
    },
  },
};

async function startServer() {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();
  const httpServer = createServer(app);

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();

  // app.use("/graphql", bodyParser.json(), expressMiddleware(apolloServer));

  apolloServer.applyMiddleware({ app });

  httpServer.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${apolloServer.graphqlPath}`
    );
  });
}

startServer();
