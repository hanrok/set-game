import { useContext, useState } from "react";
import { Context, ContextValues } from "./Context";
import { validatePossibleSet } from "@/utils/index";

import Card from "./Card";
import Alert from "./Alert";

const GameBoard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<{ type: string, message: string }|null>(null);
  const [timeoutId, setTimeoutId] = useState<any>(null);

  const {
    deck,
    selectedSet,
    cardsOnBoard,
    unselectCard,
    selectCard,
    registerSet,
    clearSelectedSet,
    replaceCards,
  } = useContext(Context) as ContextValues;

  const onSelectCard = (index: number) => {
    const selected = selectedSet.indexOf(index);
    if (selected >= 0) {
      unselectCard(index);
    } else if(selected < 0 && selectedSet.length < 3) {
      const possibleSet = selectCard(index);
      if (possibleSet.length === 3) { // If three cards were chosen, we proceed to evaluate the cards
        setShowNotification(true); // Show the notification message
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        const timer = setTimeout(() => setShowNotification(false), 4000); // Dismiss notification after 4 seconds
        setTimeoutId(timer);

        if (validatePossibleSet(possibleSet, cardsOnBoard)) {
          setNotificationMessage({ type: 'success', message: 'Enhorabuena! Haz encontrado un SET' });
          registerSet(possibleSet); // Register set finded by user
          clearSelectedSet(); // Clear possible set selected by user
          
          // replace cards
          replaceCards(possibleSet);
        } else {
          clearSelectedSet(); // Clear possible set selected by user
          setNotificationMessage({ type: 'warning', message: 'Ups! Este no es un SET, vuelve a intentarlo' });
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
            <span className="font-semibold px-2 py-1 rounded bg-gray-700 text-gray-300 mr-1">✨ Regla mágica:</span> Si dos cartas son... y una no es, entonces no es un <span className="font-semibold">SET</span>
          </>} /> }
        <div className="grid grid-cols-4 gap-x-5 gap-y-6 mb-2">
          { cardsOnBoard.map((card, index) => 
              <Card
                selected={selectedSet.indexOf(index) !== -1}
                key={index}
                config={card}
                onClick={() => onSelectCard(index)} />) }
        </div>
        <div className="py-2 flex items-center justify-center text-gray-400">
          <span className="inline-block font-semibold mr-2 text-lg text-white">{deck.length}</span>
          tarjetas restantes
        </div>
      </div>
    </section>
  </>;
}

export default GameBoard;
