import gql from "graphql-tag";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  InMemoryCache,
  //HttpLink,
  ApolloLink,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

//extending from the User type defined in the schema
//to dd the vaccination status
const typeDefs = gql`
  extend type User {
    vaccinated: Boolean!
  }
`;

const resolvers = {
  User: {
    //setting the vaccinated field to true
    vaccinated: () => true,
  },
};

const delay = setContext(
  (request) =>
    new Promise<void>((success, fail) => {
      setTimeout(() => {
        success();
      }, 800);
    })
);

const cache = new InMemoryCache();
const http = createUploadLink({
  //uri: "https://ambrosia-garden.vercel.app/graphql",
  uri: "https://sbhacks-resum-ai.vercel.app/graphql",
});

const link = ApolloLink.from([delay, http]);

const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers,
});

export default client;
