'use client'

import { createContext, ReactNode, useEffect, useState } from "react";
import { setCardsOnTable, shuffleDeck, countSets } from "@/utils/index";
import cardsList from "cards.json";
import { CardType } from "@/models/card";
import { saveScore } from "@/utils/scores";
import { useAuth } from "./AuthContext";

const GAME_TIME = 60

export type ContextValues = {
  deck: CardType[];
  sets: CardType[][];
  nsets: CardType[][] | null;
  cardsOnBoard: CardType[];
  selectedSet: CardType[];

  // timer
  elapsedTime: number,
  previousTime: number,
  timeLeft: number,

  initializeGame: () => void;
  unselectCard: (tapCard: CardType) => void;
  selectCard: (tapCard: CardType) => CardType[];
  clearSelectedSet: () => void;
  registerSet: (set: CardType[]) => void;
  replaceCards: (cardIndexes: CardType[]) => void;
  addThreeCards: () => void;
  gameOver: boolean,
  endGame: () => void,
  resetGame: () => void,
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
  // possible sets on board
  const [nsets, registerNumberOfSets] = useState<CardType[][]|null>(null);

  // timer
  const [elapsedTime, setElapsedTime] = useState(0);
  const [previousTime, setPreviousTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME * 1000)

  const {user} = useAuth();

  useEffect(() => {
    if (timeLeft < 0 || previousTime == 0) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const time = elapsedTime;
      setPreviousTime(now);
      setElapsedTime(time + (now - previousTime));
    }, 100);
    
    return () => {
      clearInterval(interval);
    }
  }, [previousTime]);

  useEffect(() => {
    if (timeLeft < 0) {
      return;
    }

    setTimeLeft(GAME_TIME * 1000 - elapsedTime);
  }, [elapsedTime]);

  useEffect(() => {
    if (timeLeft < 0) {
      endGame();
    }
  }, [timeLeft]);


  useEffect(() => {
    if (!isRunning) {
      startGame(true);
      initializeGame();
    }
  }, [cardsOnBoard, isRunning]);

  const initializeGame = () => {
    const cards = [...cardsList] as CardType[]
    
    // shuffeling deck is making the first cards to be the deck
    let setsCountOnBoard = 0
    let shuffledCards: CardType[] = [];
    while (setsCountOnBoard <= 0) {
        shuffledCards = shuffleDeck(cards); // Suffle deck
        let {size} = countSets(shuffledCards.slice(0, 12));
        setsCountOnBoard = size
    }

    const { deck, preGameCards } = setCardsOnTable(shuffledCards);
    setDeck(deck);
    setCardsOnBoard(preGameCards);

    const { sets } = countSets(preGameCards);
    registerNumberOfSets(sets);

    //timer
    setPreviousTime(Date.now());
    setElapsedTime(0);
    setTimeLeft(GAME_TIME * 1000);
  }

  // Function to unselect a selected card 
  const unselectCard = (cardTap: CardType) => {
    cardTap.selected = false;
    updateSelectedSet(selectedSet => selectedSet.filter(c => c !== cardTap));
  };

  // Function to add the selected card to array with selected cards
  const selectCard = (cardTap: CardType): CardType[] => {
    cardTap.selected = true;
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
  const clearSelectedSet = () => {
    setCardsOnBoard(cards => cards.map(c => {c.selected = false; return c}));
    updateSelectedSet([]);
  };

  const replaceCards = (cards: CardType[]) => {
    const cardsIndexes: number[] = cardsOnBoard.map((card, idx) => ([card, idx])).filter((item) => cards.includes(item[0] as CardType)).map(item => item[1] as number);
    const currentCardsOnBoard = [...cardsOnBoard];
    let currentDeck = [...deck];

    // todo: if the JSON includes only cards that divide by 3 so it will be ok to check only if the deck is empty
    if (currentDeck.length > cards.length) {
      let newBoardSetCount = 0
      const leftCardsOnBoard = currentCardsOnBoard.filter((c, idx) => !cardsIndexes.includes(idx));
      do {
        // shuffelling till we have at least one set on board
        currentDeck = shuffleDeck(currentDeck);
        const newCards = currentDeck.slice(0, 3);
        const {size} = countSets([...leftCardsOnBoard, ...newCards]);
        newBoardSetCount = size
      } while (newBoardSetCount <= 0);

      const cardsOut = [];
      cardsIndexes.forEach((cardIdx) => {
        const card = currentDeck.shift() as CardType;
        currentCardsOnBoard.splice(cardIdx, 1, card);
        cardsOut.push(card);
      });

      // add to the deck the cards that found by the player
      currentDeck.push(...cardsOut);
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
      currentCardsOnBoard.push(card);
    }

    setCardsOnBoard(currentCardsOnBoard);
    setDeck(currentDeck);

    countPossibleSets(currentCardsOnBoard);
  }

  const endGame = () => {
    setGameOver(true);
    if (user) {
      saveScore(sets.length);
    }
  }
  
  const resetGame = () => {
    setGameOver(false);
    startGame(true);
    initializeGame();
  };

  return <Context.Provider value={{
    deck,
    sets,
    nsets,
    cardsOnBoard,
    selectedSet,

    //timer
    elapsedTime,
    previousTime,
    timeLeft,
  

    //functions
    initializeGame,
    unselectCard,
    selectCard,
    clearSelectedSet,
    registerSet,
    replaceCards,
    addThreeCards,
    gameOver,
    endGame,
    resetGame,
  }}>
    { children }
  </Context.Provider>
}

export default SetGameContext;
