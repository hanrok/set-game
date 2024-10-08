/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const { onCall } = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const crypto = require("crypto");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Define encryption parameters
const algorithm = "aes-256-cbc"; // Use AES encryption
const key = Buffer.from("3L3M3N74RY-D4T4-S3T3L3M3N74RY-D4", "utf8");
const iv = Buffer.from("RANDOM-VECTOR!@#", "utf8");

// Function to encrypt data
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`; // Return IV with encrypted data
}

// Function to decrypt data
function decrypt(encrypted) {
  const [iv, content] = encrypted.split(":");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(content, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Firebase function to start the game
exports.startGame = onCall((request) => {
  const timestamp = Date.now();
  const token = encrypt(timestamp.toString());
  logger.info("New game started", { uid: request.auth?.uid, timestamp, token });

  return {
    token,
    timestamp,
  };
});

// Firebase function to end the game
exports.endGame = onCall(async (request) => {
  const { token, sets } = request.data;
  const { auth } = request;

  // Get user ID
  const uid = auth.uid;

  logger.info("End game request", { uid, token });

  // Validate the token and extract the timestamp
  const gameStartTimestamp = validateTokenAndGetTimestamp(token);

  // Validate the timestamp (e.g., within 60 seconds + 10 second buffer)
  const validTimeWindow = gameStartTimestamp + 60 * 1000 + 10 * 1000;
  if (Date.now() > validTimeWindow) {
    logger.warn("Invalid end game time", { uid, gameStartTimestamp, currentTimestamp: Date.now() });
    throw new functions.https.HttpsError("invalid-argument", "Game duration exceeded the allowed time.");
  }

  // Validate the sets and update Firestore
  const validSets = await validateSets(sets);
  if (!validSets) {
    logger.warn("Invalid sets submitted", { uid });
    throw new functions.https.HttpsError("invalid-argument", "Invalid sets submitted.");
  }

  // Save the best score to Firestore and update the leaderboard
  const bestScoreSaved = await saveBestScore(uid, sets.length, token);

  // Update leaderboard with the top 10 scores only
  await updateLeaderboard(uid, sets.length);

  logger.info("Game end processed successfully", { uid, score: sets.length });

  return {
    success: true,
    bestScoreSaved,
  };
});

// Function to validate the token and extract the timestamp
function validateTokenAndGetTimestamp(token) {
  const timestamp = decrypt(token);

  const parsedTimestamp = parseInt(timestamp);
  if (isNaN(parsedTimestamp)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid token: cannot extract timestamp.");
  }

  return parsedTimestamp;
}

// Function to validate the sets (as an example)
async function validateSets(sets) {
  // Placeholder for validation logic
  // Check that each set contains valid data products, correct ordering, etc.
  return true; // Assume all sets are valid for now
}

// Function to save the best score for the user
async function saveBestScore(uid, setsFound, token) {
  const userRef = db.collection("users").doc(uid);

  // Get the current best score
  const userDoc = await userRef.get();
  const bestScore = userDoc.data()?.bestScore || 0;

  if (setsFound > bestScore) {
    await userRef.set(
      {
        bestScore: setsFound,
        token,
      },
      { merge: true },
    );

    logger.info("Best score updated", { uid, bestScore: setsFound });
    return true;
  }

  return false;
}

// Function to update the leaderboard with only the top 10 scores
async function updateLeaderboard(uid, score) {
  const leaderboardRef = db.collection("leaderboard");

  // Fetch the current top 10 leaderboard
  const leaderboardSnapshot = await leaderboardRef.orderBy("score", "desc").limit(10).get();

  try {
    // Retrieve the user record from Firebase Authentication
    const userRecord = await admin.auth().getUser(uid);
    // If the new score qualifies for the top 10
    if (leaderboardSnapshot.size < 10 || score > leaderboardSnapshot.docs[leaderboardSnapshot.size - 1].data().score) {
      logger.info("Updating leaderboard", { uid, score });

      // Add the new score
      await leaderboardRef.add({
        uid,
        score,
        name: userRecord.displayName,
        timestamp: Date.now(),
      });

      // If there are now more than 10 scores, remove the lowest one
      if (leaderboardSnapshot.size >= 10) {
        const lowestScoreDoc = leaderboardSnapshot.docs[leaderboardSnapshot.size - 1];
        await leaderboardRef.doc(lowestScoreDoc.id).delete();

        logger.info("Removed lowest score from leaderboard", { uid: lowestScoreDoc.data().uid });
      }
    } else {
      logger.info("Score did not qualify for leaderboard", { uid, score });
    }
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Unable to retrieve user information.");
  }
}
