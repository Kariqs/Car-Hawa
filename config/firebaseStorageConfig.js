const admin = require("firebase-admin");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

// Read the Base64 encoded service account key from the environment variable
const serviceAccountBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;

if (!serviceAccountBase64) {
  throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS_BASE64 environment variable.");
}

let serviceAccount;

try {
  // Decode the base64 string to JSON
  const serviceAccountDecoded = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
  serviceAccount = JSON.parse(serviceAccountDecoded);
} catch (error) {
  throw new Error("Failed to decode or parse the service account key. Please ensure it is correctly encoded.");
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "carhawa-f25a1.appspot.com",
});

const storage = admin.storage();

module.exports = storage;
