//const { MongoClient } = require("mongodb");
// const client = new MongoClient(uri);

require("dotenv").config({ path: ".env" });

const uri = process.env.MONGO_CONN;

const mongoose = require("mongoose");
const userModel = require("./user");
const recommendationsModel = require("./recommended");
const initializeDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    return {
      models: {
        User: userModel,
        Recs: recommendationsModel,
      },
      db: mongoose,
    };
  } catch (err) {
    console.error(err);
  }
};

module.exports = initializeDatabase;
