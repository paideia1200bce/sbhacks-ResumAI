const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
//import { nanoid } from "nanoid";

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4, // Use UUID v4 as the default value for the _id field
  },
  //username: String,
  username: {
    type: String,
    unique: true,
    index: true,
  },
  name: String,
  password: String,
  email: {
    type: String,
    unique: true,
  },
  bio: String,
  personality: String,
  imgUrl: String,
  university: String,
  major: String,
  dietPreference: String,
  favCuisines: [String],
  savedRecipes: [
    {
      imgUrl: String,
      name: String,
      ingredients: String,
      recipe: String,
    },
  ],
  collectionPublic: Boolean,
  profilePublic: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.index({ university: 1 });
UserSchema.index({ personality: 1 });
UserSchema.index({ major: 1 });

const UserModel = mongoose.model("Usertest", UserSchema);

module.exports = UserModel;
