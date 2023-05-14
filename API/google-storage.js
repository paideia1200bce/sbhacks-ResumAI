//const { Storage } = require("@google-cloud/storage");
const { GoogleAuth } = require("google-auth-library");

const { Storage } = require("@google-cloud/storage");
require("dotenv").config({ path: ".env" });

// const gcsCredentials = JSON.parse(
//   Buffer.from(process.env.GCS_CRED, "base64").toString("utf8")
// );

// const storage = new Storage({
//   projectId: "itchaeli",
//   credentials: gcsCredentials,
// });

const storage = new Storage({
  projectId: "itchaeli",
  keyFilename: "./gcscreds.json",
});

const bucketName = "dallemedia";
const bucket = storage.bucket(bucketName);

module.exports = { bucket };
