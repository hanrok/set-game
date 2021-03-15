import { createContext, ReactNode, useState } from "react";
import { generateCards } from "@/utils/index";

export type ContextValues = {
  deck: number[][];
  initializeGame: () => void;
}

// Creating a new context
export const Context = createContext<ContextValues|null>(null);

const SetGameContext = ({ children }: { children?: ReactNode; }) => {
  const [deck, setDeck] = useState<number[][]>([]);

  const initializeGame = () => {
    const cards = generateCards();
    setDeck(cards);
  }

  return <Context.Provider value={{
    deck,
    initializeGame,
  }}>
    { children }
  </Context.Provider>
}

export default SetGameContext;
