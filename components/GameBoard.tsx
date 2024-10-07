'use client'

import { useContext, useEffect } from "react";
import { Context, ContextValues } from "./Context";
import { countSets, validatePossibleSet } from "@/utils";
import { FaPlayCircle } from "react-icons/fa";
import { FaTable } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";


import Card from "./Card";
import Modal from "./Modal";
import Header from "./partials/Header";
import { CardType } from "@/models/card";
import Link from "next/link";
import { useAuth } from "./AuthContext";
import useSound from "use-sound";

const GameBoard = () => {
  const {user} = useAuth();
  const {
    deck,
    nsets,
    sets,
    addThreeCards,
    selectedSet,
    cardsOnBoard,
    unselectCard,
    selectCard,
    registerSet,
    clearSelectedSet,
    replaceCards,
    endGame,
    gameOver,
    resetGame,
    firstTime,
    initializeGame,
  } = useContext(Context) as ContextValues;
  const [playRightSound] = useSound('assets/sounds/right.wav');

  const onSelectCard = (tapCard: CardType) => {
    if (tapCard.selected) {
      unselectCard(tapCard);
    } else if (selectedSet.length < 3) {
      const possibleSet = selectCard(tapCard);
      if (possibleSet.length === 3) {
        // If three cards were chosen, we proceed to evaluate the cards
        
        if (validatePossibleSet(possibleSet)) {
          playRightSound();
          registerSet(possibleSet); // Register set finded by user
          clearSelectedSet(); // Clear possible set selected by user
          
          // check if there is no sets in the deck with the cards on board
          const allCards = [...deck, ...cardsOnBoard];
          let {size} = countSets(allCards)
          if (size > 0) {
            // replace cards
            replaceCards(possibleSet);
          } else {
            // there is no more sets in cards
            endGame();
          }
        } else {
          clearSelectedSet(); // Clear possible set selected by user
        }
      }
    }
  };

  useEffect(() => {
    if (!firstTime) {
      resetGame();
    }
  }, []);

  return (
    <div className="flex flex-col flex-grow">
      <Header />
      {gameOver ? 
        <div className="flex flex-grow flex-col justify-center m-4">
          <div className="items-center text-center rounded">
            <h2 className="text-white mb-20 pt-2 text-6xl font-bold text-stroke text-stroke-gray-200">GAME OVER!</h2>
            <div className="flex flex-col">
              <div className="text-white mb-10">You found <span className="font-bold text-3xl mx-2">{sets.length}</span> sets!</div>
              <div className="flex flex-col p-10 space-y-2">
                <div className="flex flex-grow">
                  <button className="flex items-center justify-center bg-pink-1200 py-5 rounded-md text-white font-bold flex-grow" onClick={() => resetGame()}>
                    <FaPlayCircle className="mr-2" size={24} /> PLAY AGAIN!
                  </button>
                </div>
                <div className="flex justify-between space-x-2 items-stretch">
                  <Link href="/scores" className="flex-grow flex">
                    <button className="flex items-center justify-center bg-gray-1300 py-5 px-5 rounded-md text-gray-900 font-bold flex-grow">
                      <FaTable className="mr-2" size={24} /> SCORE TABLE
                    </button>
                  </Link>
                  {/* if user not logged in */}
                  {(!user) && <Link href="/signin" className="flex-grow flex">
                    <button className="flex flex-grow items-center justify-center bg-orange-1200 py-5 px-5 rounded-md text-white font-bold">
                      <FaUserCircle className="mr-2" size={24} /> Register
                    </button>
                  </Link>}
                </div>
              </div>
            </div>
          </div>
        </div> 
      :
        <>
          <section className="flex flex-col px-4 flex-grow justify-center">
            <div className="flex flex-col px-6 justify-center flex-grow">
              <div className="grid grid-cols-3 grid-rows-4 gap-x-4 gap-y-4" style={{height: "65vh"}}>
                {cardsOnBoard.map((card, index) => (
                  <Card key={index} config={card} onClick={() => onSelectCard(card)} />
                ))}
              </div>
              <div className="py-2 flex items-center justify-between text-gray-400">
                <div className="flex items-center">
                  
                </div>
                <div className="flex items-center">
                  Set Posibles:
                  <span className="inline-block font-semibold ml-2 text-lg text-white">{nsets?.length}</span>
                </div>
              </div>
            </div>
          </section>
          {firstTime && <Modal onClick={() => initializeGame()} />}
        </>
      }
    </div>
  );
};

export default GameBoard;
