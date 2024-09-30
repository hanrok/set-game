'use client'

import { useContext, useEffect, useState } from "react";
import { Context, ContextValues } from "./Context";
import { countSets, validatePossibleSet } from "@/utils";


import Card from "./Card";
import Alert from "./Alert";
import Modal from "./Modal";
import Header from "./partials/Header";
import { CardType } from "@/models/card";
import Link from "next/link";

const GameBoard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<{ type: string; message: string } | null>(null);
  const [timeoutId, setTimeoutId] = useState<any>(null);

  const { deck, nsets, addThreeCards, selectedSet, cardsOnBoard, unselectCard, selectCard, registerSet, clearSelectedSet, replaceCards, endGame, gameOver, resetGame } = useContext(Context) as ContextValues;

  useEffect(() => {
    if (nsets?.length === 0) {
      console.log("no mas set");
    }
  }, [nsets]);

  const onSelectCard = (tapCard: CardType) => {
    const selected = selectedSet.indexOf(tapCard);
    if (selected >= 0) {
      unselectCard(tapCard);
    } else if (selected < 0 && selectedSet.length < 3) {
      const possibleSet = selectCard(tapCard);
      if (possibleSet.length === 3) {
        // If three cards were chosen, we proceed to evaluate the cards
        setShowNotification(true); // Show the notification message
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        const timer = setTimeout(() => setShowNotification(false), 4000); // Dismiss notification after 4 seconds
        setTimeoutId(timer);

        console.log("validatePossibleSet(possibleSet)", validatePossibleSet(possibleSet));
        if (validatePossibleSet(possibleSet)) {
          setNotificationMessage({ type: "success", message: "Enhorabuena! Haz encontrado un SET" });
          registerSet(possibleSet); // Register set finded by user
          clearSelectedSet(); // Clear possible set selected by user
          
          // check if there is no sets in the deck with the cards on board
          const allCards = [...deck, ...cardsOnBoard];
          let {size} = countSets(allCards)
          console.log("left possible sets", allCards, size);
          if (size > 0) {
            // replace cards
            replaceCards(possibleSet);
          } else {
            // there is no more sets in cards
            endGame();
          }
        } else {
          clearSelectedSet(); // Clear possible set selected by user
          setNotificationMessage({ type: "warning", message: "Ups! Este no es un SET, vuelve a intentarlo" });
        }
      }
    }
  };

  const handleEventModal = () => addThreeCards();

  // console.log("deck", deck);
  // console.log("nsets", nsets);
  // console.log("selectedSet", selectedSet);
  // console.log("cardsOnBoard", cardsOnBoard);

  return (
    <div className="flex flex-col flex-grow">
      <Header />
      {gameOver ? 
        <div className="flex flex-grow flex-col justify-start m-4">
          <div className="bg-gray-100 items-center text-center rounded-lg">
            <h2 className="text-gray-800 mb-4 pt-2 text-2xl font-bold">GAME OVER</h2>
            <div className="flex flex-col">
              <div>You got 31 Points!</div>
              <div className="flex flex-col p-10 space-y-2">
                <div className="flex flex-grow">
                  <button className="flex-grow bg-gray-900 text-white font-bold py-2 px-4 rounded-lg" onClick={() => {console.log("clicked"); resetGame();}}>Play Again!</button>
                </div>
                <div className="flex justify-between space-x-2">
                  <Link href="/scores">
                    <button className="flex-grow bg-gray-900 text-white font-bold py-2 px-4 rounded-lg">Table score</button>
                  </Link>
                  <button className="flex-grow bg-gray-900 text-white font-bold py-2 px-4 rounded-lg">Register</button>
                </div>
              </div>
            </div>
          </div>
        </div> 
      :
        <>
          <section className="flex flex-col px-4">
            <div className="flex flex-col px-6 md:px-8 lg:px-4 xl:px-0">
              {/* TODO: understand if relevant */}
              {/* {showNotification ? (
                <Alert type={notificationMessage?.type} message={notificationMessage?.message} />
              ) : (
                <Alert
                  message={
                    <>
                      <span className="font-semibold px-2 py-1 rounded bg-gray-700 text-gray-300 mr-1">✨ Regla mágica:</span> Si dos cartas son... y una no es, entonces no es un <span className="font-semibold">SET</span>
                    </>
                  }
                />
              )} */}
              <div className="grid grid-cols-3 gap-x-2 gap-y-2 mb-2">
                {cardsOnBoard.map((card, index) => (
                  <Card selected={selectedSet.indexOf(card) !== -1} key={index} config={card} onClick={() => onSelectCard(card)} />
                ))}
              </div>
              <div className="py-2 flex items-center justify-between text-gray-400">
                <div className="flex items-center">
                  Deck
                  <span className="inline-block font-semibold ml-2 text-lg text-white">{deck.length}</span>
                </div>
                <div className="flex items-center">
                  Set Posibles:
                  <span className="inline-block font-semibold ml-2 text-lg text-white">{nsets?.length}</span>
                </div>
              </div>
            </div>
          </section>
          {/* TODO: understand what to do if there are no sets */}
          {/* {nsets?.length === 0 && <Modal onClick={handleEventModal} />} */}
        </>
      }
    </div>
  );
};

export default GameBoard;
