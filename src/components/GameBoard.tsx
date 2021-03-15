import { useContext, useEffect, useState } from "react";
import { Context, ContextValues } from "./Context";
import { validatePossibleSet } from "@/utils/index";

import Card from "./Card";
import Alert from "./Alert";

const GameBoard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<{ type: string, message: string }|null>(null);

  const {
    selectedSet,
    initializeGame,
    cardsOnBoard,
    unselectCard,
    selectCard,
    registerSet,
    clearSelectedSet,
  } = useContext(Context) as ContextValues;

  useEffect(() => {
    initializeGame();
  }, []);

  const onSelectCard = (index: number) => {
    const selected = selectedSet.indexOf(index);
    if (selected >= 0) {
      unselectCard(index);
    } else if(selected < 0 && selectedSet.length < 3) {
      const possibleSet = selectCard(index);
      if (possibleSet.length === 3) { // If three cards were chosen, we proceed to evaluate the cards
        setShowNotification(true); // Show the notification message
        setTimeout(() => setShowNotification(false), 4000); // Dismiss notification after 4 seconds

        if (validatePossibleSet(possibleSet, cardsOnBoard)) {
          setNotificationMessage({ type: 'success', message: 'Ahuevo! Encontrastre un SET' });
          registerSet(possibleSet); // Register set finded by user
          clearSelectedSet(); // Clear possible set selected by user
        } else {
          clearSelectedSet(); // Clear possible set selected by user
          setNotificationMessage({ type: 'warning', message: 'Nee! La cagaste wey, checale bien' });
        }
      }
    }
  }

  return <>
    <section className="py-4">
      <div className="container mx-auto px-6 md:px-8 lg:px-4 xl:px-0 max-w-screen-lg relative">
        { showNotification
          ? <Alert type={notificationMessage?.type} message={notificationMessage?.message} />
          : <Alert message={<>
            <span className="font-semibold px-2 py-1 rounded bg-yellow-50 text-yellow-800 mr-1">✨ Regla mágica:</span> Si dos cartas son... y una no es, entonces no es un SET
          </>} /> }
        <div className="grid grid-cols-4 gap-x-5 gap-y-6">
          { cardsOnBoard.map((card, index) => 
              <Card
                selected={selectedSet.indexOf(index) !== -1}
                key={index}
                config={card}
                onClick={() => onSelectCard(index)} />) }
        </div>
        <div className="py-2 flex items-center text-gray-400">
          <span className="inline-block text-bold mr-2 text-lg text-white">69</span>
          tarjetas restantes
        </div>
      </div>
    </section>
  </>;
}

export default GameBoard;
