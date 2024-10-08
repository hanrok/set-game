import cn from "clsx";
import React, { useEffect, useState } from "react";
import { Bounce, Fade } from "react-awesome-reveal";
import { CardType as CardType } from "@/models/card";
import useSound from "use-sound";

interface ICardProps {
  config: CardType;
  selected?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showHint?: boolean;  // Prop to trigger the flip animation for hint
}

const Card = ({ config, onClick, showHint = false }: ICardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [playTapSound] = useSound('assets/sounds/tap.wav');
  const containerClassName = cn("flex flex-col justify-center rounded", {
    "m-1": config.selected,
    "border-4": config.selected,
    "bg-gray-1200": !config.selected,
    "bg-gray-1300": config.selected,
  });

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isFlipped) {
      playTapSound();
      onClick(e);
    }
  };

  // If `showHint` is true, flip the card for 1 second
  useEffect(() => {
    if (showHint) {
      setIsFlipped(true);
      setTimeout(() => {
        setIsFlipped(false);
      }, 1500);  // Show the category for 1 second
    }
  }, [showHint]);

  return (
    <Bounce className={containerClassName} key={config.name}>
      <button onClick={handleOnClick} className="flex flex-col flex-grow justify-center text-gray-900 rounded overflow-hidden items-stretch">
        {!isFlipped ?
          <div className="flex flex-col flex-grow justify-between items-center px-4 py-2">
            <div className="flex-grow w-full h-full bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url('${config.logo}')` }}>
            </div>
            <div className="text-sm pt-2 font-medium">
              {config.name}
            </div>
          </div>
          : 
          <Fade className="flex-grow flex flex-col justify-center bg-orange-1200 text-gray-100">
            <div className="align-bottom text-xs">
              My category is<br />
              <span className="font-bold text-md">{config.category}</span>
            </div>
          </Fade>
        }
      </button>
    </Bounce>
  );
};

export default Card;
