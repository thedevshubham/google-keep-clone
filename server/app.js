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
    isPinned: Boolean
    label: [String]
  }

  type Query {
    notes: [Note]
    trashNotes: [Note]
    getLabels: [String]
    searchNotes(term: String!, isTrash: Boolean): [Note]
  }

  type Mutation {
    createNote(
      title: String
      content: String
      color: String
      label: [String]
      isPinned: Boolean
    ): Note

    updateNote(
      id: ID!
      title: String
      content: String
      color: String
      label: [String]
      isPinned: Boolean
    ): Note

    deleteLabel(id: ID!, label: String): Note

    pinNotes(id: [ID]): [Note]

    deleteNote(id: ID!): Note
  }

  type Subscription {
    noteCreated: Note
    noteUpdated: Note
    noteDeleted: [Note]
    trashUpdated: [Note]
    labelAdded: [String]
  }
`;

const colorMap = {
  black: "#000000",
  white: "#ffffff",
  gray: "#808080",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  purple: "#800080",
  pink: "#ffc0cb",
  orange: "#ffa500",
  brown: "#a52a2a",
  lightGreen: "#68BC00",
};

let notes = [
  {
    id: "007e3c43-0720-4119-9bc7-57a0ad1155da",
    title: "Cryptocurrency",
    color: "#ffffff",
    label: ["label1", "label2"],
    isPinned: false,
    content:
      "Cryptocurrency is a digital or virtual currency that uses cryptography for security. It operates independently of a central bank and can be transferred directly between individuals. Bitcoin, Ethereum, and Litecoin are some examples of popular cryptocurrencies.",
    __typename: "Note",
  },
  {
    id: "67b38042-26a9-410d-b619-6c0fbf4d299e",
    title: "Meditation",
    color: "#ffffff",
    label: ["label1", "label2"],
    isPinned: false,
    content:
      "Meditation is a practice where an individual uses a technique, such as mindfulness or focusing on a particular object, to train attention and awareness and achieve a mentally clear and emotionally calm state. It has been shown to have many physical and mental health benefits, such as reducing stress and anxiety and improving sleep.",
    __typename: "Note",
  },
  {
    id: "3661bdfb-d37c-4e87-8dd4-e1a11e82e58d",
    title: "Artificial Intelligence",
    color: "#ffffff",
    label: ["label1", "label2"],
    isPinned: false,
    content:
      "Artificial Intelligence (AI) is a branch of computer science that aims to create machines that can perform tasks that normally require human intelligence, such as visual perception, speech recognition, decision-making, and language translation. AI has many applications in various fields, such as healthcare, finance, and transportation.",
    __typename: "Note",
  },
  {
    id: "2acf5184-6d72-459d-a1ef-d15649fbd364",
    title: "Sustainable Fashion",
    color: "#ffffff",
    label: ["label1", "label2"],
    isPinned: false,
    content:
      "Sustainable fashion is a movement that seeks to create clothing and accessories in an environmentally and socially responsible way. It involves using eco-friendly materials, reducing waste, and promoting fair labor practices. Sustainable fashion brands are becoming more popular as consumers become more conscious of the impact of their purchasing decisions.",
    __typename: "Note",
  },
];

let trashNotes = [];

let labels = ["label1", "label2"];

const resolvers = {
  Query: {
    notes: () => notes,
    trashNotes: () => trashNotes,
    getLabels: () => labels,
    searchNotes: (parent, args) => {
      if (args.term) {
        const searchTerm = args.term.toLowerCase();
        const searchArray = args.isTrash ? trashNotes : notes;
        const allNotes = [...searchArray];
        const searchedNotes = allNotes.filter((note) => {
          const isTitleMatched = note.title.toLowerCase().includes(searchTerm);
          const isColorMatched =
            note.color.toLowerCase() === colorMap[searchTerm];
          const isLabelMatched = note.label.some(
            (label) => label.toLowerCase() === searchTerm
          );
          const isContentMatched = note.content
            .toLowerCase()
            .includes(searchTerm);
          return (
            isTitleMatched ||
            isColorMatched ||
            isLabelMatched ||
            isContentMatched
          );
        });
        return searchedNotes;
      }
    },
  },

  Mutation: {
    createNote: (parent, args) => {
      const note = {
        id: uuid(),
        title: args.title,
        content: args.content,
        color: args.color || "#ffffff",
        isPinned: false,
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
      note.isPinned = args.isPinned ?? note.isPinned;
      if (args?.label?.length > 0) {
        const notesUniqueLabel = args.label.filter(
          (item) => !note.label.includes(item)
        );
        const labelUniquelabels = args.label.filter(
          (item) => !labels.includes(item)
        );
        if (notesUniqueLabel.length > 0) {
          note.label.push(...notesUniqueLabel);
        }
        if (labelUniquelabels.length > 0) {
          labels.push(...labelUniquelabels);
          pubsub.publish("NEW_LABEL_ADDED", { labelAdded: labels });
        }
      }
      pubsub.publish("NOTE_UPDATED", { noteUpdated: note });
      return note;
    },

    deleteLabel: (parent, args) => {
      const note = notes.find((note) => note.id === args.id);
      let updatedLabels = note.label.filter((lbl) => lbl !== args.label);
      note.label = [...updatedLabels];
      pubsub.publish("NOTE_UPDATED", { noteUpdated: note });
      return note;
    },

    pinNotes: (parent, args) => {
      const pinnedNotes = notes.filter((note) => args.id.includes(note.id));
      pinnedNotes.forEach((note) => (note.isPinned = true));

      return pinnedNotes;
    },

    deleteNote: (parent, args) => {
      let deletedItem;
      notes = notes.filter((item, index) => {
        if (item.id !== args.id) {
          return item;
        } else {
          deletedItem = item;
        }
      });

      trashNotes.push(deletedItem);

      pubsub.publish("NOTE_DELETED", { noteUpdated: notes }); // publish a message on the 'NOTE_DELETED' channel
      pubsub.publish("TRASH_UPDATED", { trashNotesUpdated: trashNotes }); // publish a message on the 'NOTE_DELETED' channel

      return deletedItem;
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
    noteDeleted: {
      subscribe: () => pubsub.asyncIterator("NOTE_DELETED"),
      resolve: (payload) => payload.noteUpdated,
    },
    trashUpdated: {
      subscribe: () => pubsub.asyncIterator("TRASH_UPDATED"),
      resolve: (payload) => payload.trashNotesUpdated,
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
