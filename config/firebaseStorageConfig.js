const admin = require("firebase-admin");
require("dotenv").config();
const path = require("path");

const serviceAccount = path.join(
  __dirname,
  "car-hawa-firebase-adminsdk-fftae-56d3bab26e.json"
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "car-hawa.appspot.com",
});

const storage = admin.storage();

module.exports = storage;
