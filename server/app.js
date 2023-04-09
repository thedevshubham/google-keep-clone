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
    title: String!
    color: String!
    content: String!
  }

  type Query {
    notes: [Note!]!
  }

  type Mutation {
    createNote(title: String!, content: String!, color: String): Note!
    updateNote(id: ID!, title: String, content: String, color: String): Note!
  }

  type Subscription {
    noteCreated: Note!
    noteUpdated(id: ID!): Note!
  }
`;

const notes = [
  {
    id: "007e3c43-0720-4119-9bc7-57a0ad1155da",
    title: "Shell Scripting",
    color: "#ffffff",
    content:
      "Shell scripting is the process of writing and executing commands and scripts using a shell, which is a command-line interface for interacting with an operating system. Shell scripts are typically used for automating tasks, managing system configurations, and performing various administrative tasks.",
    __typename: "Note",
  },
  {
    id: "67b38042-26a9-410d-b619-6c0fbf4d299e",
    title: "Shell Scripting Description",
    color: "#ffffff",
    content:
      "No, it is not possible to do shell scripting using JavaScript.\n\nShell scripting is the process of writing and executing commands and scripts using a shell, which is a command-line interface for interacting with an operating system. Shell scripts are typically used for automating tasks, managing system configurations, and performing various administrative tasks.\n\nJavaScript, on the other hand, is a programming language that is primarily used for developing web applications and client-side scripting. It is not designed for interacting with the operating system and does not provide access to the system-level commands and functionality that are required for shell scripting.\n\nThat being said, there are other scripting languages that are specifically designed for shell scripting, such as Bash, Python, and Perl. These languages have built-in support for interacting with the shell and are more suitable for writing shell scripts than JavaScript.",
    __typename: "Note",
  },
  {
    id: "d9e1fdf2-a2fd-47a1-8919-648de6a1d700",
    title: "JavaScript",
    color: "#ffffff",
    content:
      "Yes, JavaScript is a programming language. It is a high-level, interpreted programming language that is used primarily to create dynamic web content and interactive user interfaces. JavaScript was originally developed for use in web browsers, but its versatility and flexibility have led to its use in a wide variety of applications, including server-side web development, desktop and mobile applications, game development, and more.",
    __typename: "Note",
  },
  {
    id: "615239b7-c8df-4de9-ad02-a90b2454b60c",
    title: "JavaScript Description",
    color: "#ffffff",
    content:
      "Yes, JavaScript is a programming language. It is a high-level, interpreted programming language that is used primarily to create dynamic web content and interactive user interfaces. JavaScript was originally developed for use in web browsers, but its versatility and flexibility have led to its use in a wide variety of applications, including server-side web development, desktop and mobile applications, game development, and more.\n\nJavaScript is a powerful and flexible language that supports a variety of programming paradigms, including object-oriented, functional, and procedural programming. It is widely used in web development alongside HTML and CSS, and is often used with popular libraries and frameworks such as React, Angular, and Node.js.\n\nIn summary, JavaScript is a widely used programming language that has become an essential tool for creating dynamic and interactive web content and applications.",
    __typename: "Note",
  },
  {
    id: "c8a4767a-a1da-4f84-a14a-3fefa8ca1b69",
    title: "Virtusa",
    color: "#ffffff",
    content:
      "Virtusa is primarily a service-based company, although it also offers some products and platforms. The company provides a wide range of IT consulting, technology, and outsourcing services to its clients, including software development, application maintenance and support, testing and quality assurance, data management and analytics, and digital transformation services.",
    __typename: "Note",
  },
  {
    id: "0e35a944-c563-4d51-afe8-e78027b18e0d",
    title: "Virtusa Description",
    color: "#ffffff",
    content:
      "Virtusa is primarily a service-based company, although it also offers some products and platforms. The company provides a wide range of IT consulting, technology, and outsourcing services to its clients, including software development, application maintenance and support, testing and quality assurance, data management and analytics, and digital transformation services.\n\nIn addition to its services, Virtusa also offers several products and platforms, such as its VirtusaPolaris Digital Wallet platform, which enables secure and convenient mobile payments, and its Virtusa Open Innovation Platform, which is designed to help organizations accelerate their innovation initiatives.\n\nOverall, while Virtusa does offer some products and platforms, the company's main focus is on providing services to its clients to help them address their technology and business challenges.",
    __typename: "Note",
  },
  {
    id: "6d77e03e-6f81-4130-991d-eae5748639cc",
    title: "Workflow",
    color: "#ffffff",
    content:
      "The workflow domain refers to a specific area or field of work that involves the design, analysis, and optimization of workflows or business processes. In other words, it's the study of how work is performed within an organization, including how tasks are organized, how information is shared, how decisions are made, and how resources are allocated.",
    __typename: "Note",
  },
];

const resolvers = {
  Query: {
    notes: () => notes,
  },

  Mutation: {
    createNote: (parent, args) => {
      const note = {
        id: uuid(),
        title: args.title,
        content: args.content,
        color: args?.color || "#ffffff",
      };
      notes.push(note);
      pubsub.publish("NOTE_CREATED", { noteCreated: note });
      return note;
    },

    updateNote: (parent, args) => {
      const note = notes.find((note) => note.id === args.id);
      note.title = args.title || note.title;
      note.content = args.content || note.content;
      note.color = args.color || note.color;
      pubsub.publish("NOTE_UPDATED", { noteUpdated: note });
      return note;
    },
  },

  Subscription: {
    noteCreated: {
      subscribe: () => pubsub.asyncIterator("NOTE_CREATED"),
      resolve: (payload) => {
        const note = payload?.noteCreated;
        if (!note) {
          throw new Error("Note is null");
        }
        return {
          id: note.id,
          title: note.title,
          content: note.content,
          color: note.color,
        };
      },
    },

    noteUpdated: {
      subscribe: () => pubsub.asyncIterator("NOTE_UPDATED"),
      resolve: (payload) => {
        return {
          id: payload.noteUpdated.id,
          title: payload.noteUpdated.title,
          content: payload.noteUpdated.content,
          color: payload.noteUpdated.color,
        };
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
