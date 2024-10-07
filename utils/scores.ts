import { db, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveScore = async (setsFound) => {
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
