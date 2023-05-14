const { gql } = require("apollo-server");

const typeDefs = gql`
  #enforces the structure and contents of clientside json req payload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query { #the query can be of any name but the input type and return types are usually defined in the schema
    usertestID(userID: String): String #a query which can be used to get user details based on user id
  }
  # type UploadResumePayload {
  #   success: Boolean!
  #   message: String
  #   file: File
  # }

  type Mutation {
    saveResume(input: String): String
  }
`;

module.exports = typeDefs;
