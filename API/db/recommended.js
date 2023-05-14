const mongoose = require("mongoose");
const nanoid = require("nanoid");
const { v4: uuidv4 } = require("uuid");
//import { nanoid } from "nanoid";

const RecommendedSchema = new mongoose.Schema({
  _id: String, //look into correct implementation of nanoid() to avoid stale id
  user: String,
  recommendedUsers: [
    {
      // userId: String,
      _id: String,
      username: String,
      similarity: Number,
      // Include other relevant fields for a recommended user, if needed
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RecommendationModel = mongoose.model(
  "Recommendationtest",
  RecommendedSchema
);

module.exports = RecommendationModel;
