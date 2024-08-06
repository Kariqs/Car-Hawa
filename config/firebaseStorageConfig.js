const admin = require("firebase-admin");
require("dotenv").config();

// Decode base64 string from environment variable
const serviceAccountBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
const serviceAccountDecoded = Buffer.from(
  serviceAccountBase64,
  "base64"
).toString("utf8");

// Parse the decoded JSON string
const serviceAccount = JSON.parse(serviceAccountDecoded);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "carhawa-f25a1.appspot.com",
});

const storage = admin.storage();

module.exports = storage;
