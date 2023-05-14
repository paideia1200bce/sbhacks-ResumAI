const tf = require("@tensorflow/tfjs");
const { v4: uuidv4 } = require("uuid");
const Redis = require("ioredis");
const axios = require("axios");
const { bucket } = require("./google-storage");
const {
  indexAmbrosiaProfile,
  searchAmbrosiaProfiles,
  updateElasticsearchUser,
} = require("./elasticsearch");
//import { CourierClient } from "@trycourier/courier";
const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient({
  authorizationToken: "pk_prod_639FEYNKQX4ZZMPDJKTTS4TQETX6",
});
const { createReadStream } = require("fs");
require("dotenv").config({ path: ".env" });
//const { GraphQLUpload } = require("graphql-upload");

const apiKey = process.env.OPEN_API_KEY;

function getNewRedisClient() {
  const client = new Redis({
    // Add your configuration options here, if needed
    password: "DLtLfalG0P1q4DEC6NZIQB54Z23WCImL",
    host: "redis-15161.c246.us-east-1-4.ec2.cloud.redislabs.com",
    port: 15161,
  });
  console.log("New Redis client created");

  return client;
}

//const redisClient = getNewRedisClient();

//handle uploads to gcs
async function uploadImageToGCS(base64Image, filename) {
  const buffer = Buffer.from(base64Image, "base64");

  const file = bucket.file(filename);
  const stream = file.createWriteStream({
    metadata: {
      contentType: "image/png", // or the appropriate content type of your image
    },
    public: true, // set the access control to allow public read access
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (error) => {
      console.error("Error uploading image to Google Cloud Storage:", error);
      reject(error);
    });

    stream.on("finish", () => {
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      resolve(imageUrl);
    });

    stream.end(buffer);
  });
}

const possibleCuisines = [
  "italian",
  "indian",
  "german",
  "chinese",
  "greek",
  "ethiopian",
  "japanese",
  "korean",
  "malaysian",
  "vietnamese",
  "british",
  "french",
  "russian",
  "cuban",
  "persian",
  "israeli",
  "turkish",
];

function oneHotEncodeCuisines(cuisines) {
  //match based on hobbies later?
  const encodedHobbies = possibleCuisines.map((cuisine) =>
    cuisines.includes(cuisine) ? 1 : 0
  );
  return encodedHobbies;
}

//finding compatible users:
async function findCompatibleUsers(models, targetUser) {
  //to normalize the string values to numerical
  const dietPreference = {
    vegetarian: 1,
    vegan: 2,
    pescaterian: 3,
    glutenfree: 4,
    dairyfree: 5,
    kosher: 6,
    halal: 7,
  };

  const major = {
    "Computer Science": 1,
    "Mechanical Engineering": 2,
    "Electrical Engineering": 3,
    "Civil Engineering": 4,
    Physics: 5,
    Mathematics: 6,
  };

  const personality = {
    introvert: 1,
    extrovert: 2,
    ambivert: 3,
  };

  //const encodedValue = categories[user.pets];

  // Fetch all users
  const users = await models.User.find({});
  const filteredUsers = users.filter(
    (user) => user.username !== targetUser.username
  ); // Assuming 'id' as the unique identifier, replace 'id' with the appropriate field if necessary

  // Process user data into tensors and store in userTensors
  const userTensors = filteredUsers.map((user) => {
    const encodedCuisines = oneHotEncodeCuisines(user.favCuisines);
    // Convert user data into a tensor
    // (Modify this to use the features you want to consider for compatibility)
    return tf.tensor([
      // user.hobbies,
      major[user.major] || 0,
      personality[user.personality] || 0,
      dietPreference[user.dietPreference] || 0,
      ...encodedCuisines,
    ]);
  });

  // Compute the cosine similarity between the target user and all other users
  const targetUserEncodedCuisines = oneHotEncodeCuisines(
    targetUser.favCuisines
  );
  const targetUserTensor = tf.tensor([
    major[targetUser.major] || 0,
    personality[targetUser.personality] || 0,
    dietPreference[targetUser.dietPreference] || 0,
    ...targetUserEncodedCuisines,
  ]);

  //calculate similarity score for each userTensor in the userTensors array
  const similarities = await Promise.all(
    userTensors.map(async (userTensor) => {
      const dotProduct = tf.sum(tf.mul(userTensor, targetUserTensor));
      const userTensorMagnitude = tf.norm(userTensor);
      const targetUserTensorMagnitude = tf.norm(targetUserTensor);
      return dotProduct
        .div(
          userTensorMagnitude.add(1e-8).mul(targetUserTensorMagnitude.add(1e-8))
        )
        .arraySync();
    })
  );

  // Sort users by similarity and return the most compatible users
  const sortedUsers = filteredUsers
    .map((user, index) => ({
      ...user._doc,
      similarity: similarities[index],
    }))
    .sort((a, b) => b.similarity - a.similarity);

  console.log("sorted users recommender function", sortedUsers.slice(1));
  return sortedUsers.slice(1); // Exclude the target user from the result
}

//the resolvers are used to assign business logic to the graphql schema
//for example, the user query below corresponds with the user(..) field defined in the query type
//in schema.js //the { input } is the input from the client which has to conform to the input parameter of input type
//UserInput defined in the schema. the resolvers get executed whenever a query is made with the query name matching one of the
//query fields defined in the query type (schema.js)
module.exports = {
  //Upload: GraphQLUpload,
  Query: {
    async usertestID(_, { userID }, { models }) {
      console.log("Input:", userID);
      try {
        const user = await models.User.findOne({
          _id: userID,
        }).exec();
        console.log("User:", user);
        return user;
      } catch (error) {
        console.error("Error in user resolver:", error);
        throw error;
      }
    },
  },

  Mutation: {
    //handles the resume logic
    saveResume: async (_, { input }, { models }) => {
      //infer data from pdf

      try {
        const { createReadStream, filename, mimetype, encoding } = await file;

        // Check if the file is a PDF
        if (mimetype !== "application/pdf") {
          throw new Error("File must be a PDF.");
        }

        // Process the PDF file (e.g., extract text, analyze content, etc.)
        // This part depends on the specific PDF processing library you choose.
        // See the following example for a simple way to read the PDF content
        const pdfContent = await new Promise((resolve, reject) => {
          const data = [];
          const stream = createReadStream();

          stream.on("data", (chunk) => data.push(chunk));
          stream.on("end", () => resolve(Buffer.concat(data)));
          stream.on("error", (error) => reject(error));
        });

        // TODO: Process the PDF content using a PDF processing library

        // Store the inferred data in MongoDB
        // ...

        return "resume received";
      } catch (error) {
        console.error("Error processing PDF file:", error);
        throw new Error("Failed to process PDF file.");
      }

      //store inferred data in mongoDB
      // const updatedUser = await models.User.findOneAndUpdate(
      //   { username: username },
      //   {
      //     $push: {
      //       savedRecipes: {
      //         name: dishName,
      //         imgUrl: imageUrl,
      //         //recipe: detailedPrompt,
      //       },
      //     },
      //   },
      //   { new: true } // Return the updated user document
      // );

      // if (!updatedUser) {
      //   throw new Error("User not found");
      // }

      //return "resume received";
    },

    //signup resolver mutation
  },
};
