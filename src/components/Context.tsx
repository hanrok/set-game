import { createContext, ReactNode, useEffect, useState } from "react";
import { generateCards, setCardsOnTable, shuffleDeck } from "@/utils/index";

export type ContextValues = {
  deck: number[][];
  sets: number[][][];
  cardsOnBoard: number[][];
  selectedSet: number[];
  initializeGame: () => void;
  unselectCard: (index: number) => void;
  selectCard: (index: number) => number[];
  clearSelectedSet: () => void;
  registerSet: (set: number[]) => void;
  replaceCards: (cardIndexes: number[]) => void;
}

// Creating a new context
export const Context = createContext<ContextValues|null>(null); 

const SetGameContext = ({ children }: { children?: ReactNode; }) => {
  const [deck, setDeck] = useState<number[][]>([]); // State to store the remaining cards 
  const [cardsOnBoard, setCardsOnBoard] = useState<number[][]>([]); // State to store the current cards on board
  const [selectedSet, updateSelectedSet] = useState<number[]>([]); // State to store the cards selected by user
  const [sets, addSet] = useState<number[][][]>([]); // State to store the sets

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const cards = generateCards();
    const shuffleCards = shuffleDeck(cards); // Suffle deck
    const { deck, preGameCards } = setCardsOnTable(shuffleCards);

    setDeck(deck);
    setCardsOnBoard(preGameCards);
  }

  // Function to unselect a selected card 
  const unselectCard = (index: number) => 
    updateSelectedSet(selectedSet => selectedSet.filter(value => value !== index));

  // Function to add the selected card to array with selected cards
  const selectCard = (index: number): number[] => {
    const newArray = [...selectedSet, index];
    updateSelectedSet(newArray);

    return newArray;
  }

  /**
   * Funtion to save the set finded by the user
   * @param set number[][]
   * @returns void
   */
  const registerSet = (set: number[]) => {
    const cards = set.map(index => cardsOnBoard[index]);
    addSet([...sets, [...cards]]);
  }

  // Function to clear the possible set selected by user
  const clearSelectedSet = () => updateSelectedSet([]);

  const replaceCards = (cardsIndexes: number[]) => {
    const currentCardsOnBoard = [...cardsOnBoard];
    const currentDeck = [...deck];

    if (currentDeck.length > 0) {
      cardsIndexes.forEach((cardIndex) => {
        const card = currentDeck.pop() as number[];
        currentCardsOnBoard.splice(cardIndex, 1, card);
      });
    } else {
      cardsIndexes.forEach((cardIndex) => {
        currentCardsOnBoard.splice(cardIndex, 1);
      });
    }

    setCardsOnBoard(currentCardsOnBoard);
    setDeck(currentDeck);
  }

  return <Context.Provider value={{
    deck,
    sets,
    cardsOnBoard,
    selectedSet,
    initializeGame,
    unselectCard,
    selectCard,
    clearSelectedSet,
    registerSet,
    replaceCards,
  }}>
    { children }
  </Context.Provider>
}

export default SetGameContext;
