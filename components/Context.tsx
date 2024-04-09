import { createContext, ReactNode, useEffect, useState } from "react";
import { generateCards, setCardsOnTable, shuffleDeck, countSets } from "@/utils/index";

export type ContextValues = {
  deck: number[][];
  sets: number[][][];
  nsets: number[][][] | null;
  cardsOnBoard: number[][];
  selectedSet: number[];
  initializeGame: () => void;
  unselectCard: (index: number) => void;
  selectCard: (index: number) => number[];
  clearSelectedSet: () => void;
  registerSet: (set: number[]) => void;
  replaceCards: (cardIndexes: number[]) => void;
  addThreeCards: () => void;
}

// Creating a new context
export const Context = createContext<ContextValues|null>(null); 

const SetGameContext = ({ children }: { children?: ReactNode; }) => {
  const [isRunning, startGame] = useState(false);
  const [deck, setDeck] = useState<number[][]>([]); // State to store the remaining cards 
  const [cardsOnBoard, setCardsOnBoard] = useState<number[][]>([]); // State to store the current cards on board
  const [selectedSet, updateSelectedSet] = useState<number[]>([]); // State to store the cards selected by user
  const [sets, addSet] = useState<number[][][]>([]); // State to store the sets
  const [nsets, registerNumberOfSets] = useState<number[][][]|null>(null);

  useEffect(() => {
    if (!isRunning) {
      startGame(true);
      initializeGame();
    }
  }, [cardsOnBoard, isRunning]);

  const initializeGame = () => {
    const cards = generateCards();
    const shuffleCards = shuffleDeck(cards); // Suffle deck
    const { deck, preGameCards } = setCardsOnTable(shuffleCards);

    setDeck(deck);
    setCardsOnBoard(preGameCards);

    const { sets } = countSets(preGameCards);
    registerNumberOfSets(sets);
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

    if (currentCardsOnBoard.length > 12) {
      cardsIndexes.forEach((cardIndex) => {
        currentCardsOnBoard.splice(cardIndex, 1);
      });
    } else {
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
    }
    

    setCardsOnBoard(currentCardsOnBoard);
    setDeck(currentDeck);

    countPossibleSets(currentCardsOnBoard);
  }

  const countPossibleSets = (board: number[][]) => {
    const { sets } = countSets(board);
    registerNumberOfSets(sets);
  }

  const addThreeCards = () => {
    const currentCardsOnBoard = [...cardsOnBoard];
    const currentDeck = [...deck];
    
    for (let i = 0; i < 3; i++) {
      const card = currentDeck.pop() as number[];
      currentCardsOnBoard.push(card)
    }

    setCardsOnBoard(currentCardsOnBoard);
    setDeck(currentDeck);

    countPossibleSets(currentCardsOnBoard);
  }

  return <Context.Provider value={{
    deck,
    sets,
    nsets,
    cardsOnBoard,
    selectedSet,
    initializeGame,
    unselectCard,
    selectCard,
    clearSelectedSet,
    registerSet,
    replaceCards,
    addThreeCards,
  }}>
    { children }
  </Context.Provider>
}

export default SetGameContext;
