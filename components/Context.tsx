import { createContext, ReactNode, useEffect, useState } from "react";
import { generateCards, setCardsOnTable, shuffleDeck, countSets } from "@/utils/index";
import cardsList from "cards.json";
import { CardType } from "@/models/card";

export type ContextValues = {
  deck: CardType[];
  sets: CardType[][];
  nsets: CardType[][] | null;
  cardsOnBoard: CardType[];
  selectedSet: CardType[];
  initializeGame: () => void;
  unselectCard: (tapCard: CardType) => void;
  selectCard: (tapCard: CardType) => CardType[];
  clearSelectedSet: () => void;
  registerSet: (set: CardType[]) => void;
  replaceCards: (cardIndexes: CardType[]) => void;
  addThreeCards: () => void;
  gameOver: boolean,
  endGame: () => void
}

// Creating a new context
export const Context = createContext<ContextValues|null>(null); 

const SetGameContext = ({ children }: { children?: ReactNode; }) => {
  const [isRunning, startGame] = useState(false);
  const [deck, setDeck] = useState<CardType[]>([]); // store the remaining cards 
  const [cardsOnBoard, setCardsOnBoard] = useState<CardType[]>([]); // store the current cards on board
  const [selectedSet, updateSelectedSet] = useState<CardType[]>([]); // store the cards selected by user
  const [sets, setSet] = useState<CardType[][]>([]); // store the sets
  const [gameOver, setGameOver] = useState<boolean>(false);

  // what is it for?
  const [nsets, registerNumberOfSets] = useState<CardType[][]|null>(null);

  useEffect(() => {
    if (!isRunning) {
      startGame(true);
      initializeGame();
    }
  }, [cardsOnBoard, isRunning]);

  const initializeGame = () => {
    const cards = cardsList as CardType[]
    
    // shuffeling deck is making the first cards to be the deck
    const shuffledCards = shuffleDeck(cards); // Suffle deck
    const { deck, preGameCards } = setCardsOnTable(shuffledCards);

    setDeck(deck);
    setCardsOnBoard(preGameCards);

    const { sets } = countSets(preGameCards);
    registerNumberOfSets(sets);
  }

  // Function to unselect a selected card 
  const unselectCard = (cardTap: CardType) => 
    updateSelectedSet(selectedSet => selectedSet.filter(c => c !== cardTap));

  // Function to add the selected card to array with selected cards
  const selectCard = (cardTap: CardType): CardType[] => {
    const newArray = [...selectedSet, cardTap];
    updateSelectedSet(newArray);

    return newArray;
  }

  /**
   * Funtion to save the set finded by the user
   * @param set number[][]
   * @returns void
   */
  const registerSet = (set: CardType[]) => {
    setSet([...sets, [...set]]);
  }

  // Function to clear the possible set selected by user
  const clearSelectedSet = () => updateSelectedSet([]);

  const replaceCards = (cards: CardType[]) => {
    const cardsIndexes: number[] = cardsOnBoard.map((card, idx) => ([card, idx])).filter((item) => cards.includes(item[0] as CardType)).map(item => item[1] as number);
    const currentCardsOnBoard = [...cardsOnBoard];
    const currentDeck = [...deck];

    if (currentCardsOnBoard.length > 12) {
      // still don't know how it could happen but ok..
      cards.forEach((card) => {
        currentCardsOnBoard.splice(currentCardsOnBoard.indexOf(card), 1);
      });
    } else {
      // todo: if the JSON includes only cards that divide by 3 so it will be ok to check only if the deck is empty
      if (currentDeck.length > cards.length) {
        cardsIndexes.forEach((cardIdx) => {
          const card = currentDeck.pop() as CardType;
          currentCardsOnBoard.splice(cardIdx, 1, card);
        });
      } 
      /*else {
        cards.forEach((cardIndex) => {
          currentCardsOnBoard.splice(cardIndex, 1);
        });
      }*/
    }

    setCardsOnBoard(currentCardsOnBoard);
    setDeck(currentDeck);

    countPossibleSets(currentCardsOnBoard);
  }

  const countPossibleSets = (board: CardType[]) => {
    const { sets } = countSets(board);
    registerNumberOfSets(sets);
  }

  const addThreeCards = () => {
    const currentCardsOnBoard = [...cardsOnBoard];
    const currentDeck = [...deck];
    
    for (let i = 0; i < 3; i++) {
      const card = currentDeck.pop() as CardType;
      currentCardsOnBoard.push(card)
    }

    setCardsOnBoard(currentCardsOnBoard);
    setDeck(currentDeck);

    countPossibleSets(currentCardsOnBoard);
  }

  const endGame = () => {
    setGameOver(true);
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
    gameOver,
    endGame,
  }}>
    { children }
  </Context.Provider>
}

export default SetGameContext;
