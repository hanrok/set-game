import { db, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase";

export const saveScore = async (setsFound) => {
  const endGameFunction = httpsCallable(functions, "endGame");

  try {
    // Collect sets with their timestamps
    const setsToSubmit = sets.map(set => ({
      cards: set.cards,
      timestamp: set.timestamp, // Add timestamp when the set was found
    }));

    // Call the Firebase function to validate and save score
    const { data } = await endGameFunction({
      token: gameToken,
      sets: setsToSubmit,
      gameStartTimestamp: gameStartTimestamp,
    });

    console.log(data.message); // Success message
  } catch (error) {
    console.error("Error ending game:", error.message);
  }

  try {
    const user = auth.currentUser;
    if (user) {
      // Reference to the user's scores collection
      const scoresRef = collection(db, "users", user.uid, "scores");

      // Add a new score document
      await addDoc(scoresRef, {
        setsFound: setsFound,
        timestamp: serverTimestamp(),
      });

      console.log("Score saved successfully!");
    } else {
      console.log("No user is signed in");
    }
  } catch (error) {
    console.error("Error saving score: ", error);
  }
};
