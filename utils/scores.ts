import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase";

interface TEndGameFunction {
  message: string;
}

export const saveScore = async ({ sets, setsTimestamps, gameToken, gameStartTimestamp }) => {
  const endGameFunction = httpsCallable<unknown, TEndGameFunction>(functions, "endGame");
  
  try {
    // Collect sets with their timestamps
    const setsToSubmit = sets.map((set, idx) => ({timestamp: setsTimestamps[idx], cards: set.map(card => card.name)}));

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
};
