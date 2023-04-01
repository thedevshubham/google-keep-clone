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
    content: String!
  }

  type Query {
    notes: [Note!]!
  }

  type Mutation {
    createNote(title: String!, content: String!): Note!
    updateNote(id: ID!, title: String, content: String): Note!
  }

  type Subscription {
    noteCreated: Note!
    noteUpdated(id: ID!): Note!
  }
`;

const notes = [];

const resolvers = {
  Query: {
    notes: () => notes,
  },

  Mutation: {
    createNote: (parent, args) => {
      const note = { id: uuid(), title: args.title, content: args.content };
      notes.push(note);
      pubsub.publish("NOTE_CREATED", { noteCreated: note });
      return note;
    },

    updateNote: (parent, args) => {
      const note = notes.find((note) => note.id === args.id);
      note.title = args.title || note.title;
      note.content = args.content || note.content;
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
