import cn from "clsx";
import React from "react";
import { CardType as CardType } from "@/models/card";

interface ICardProps {
  config: CardType;
  selected?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const createImages = (config: number[]) => {
  const [shape, color, n, shading] = config;
  const shapes = [];

  for (let i = 0; i < n; i++) {
    shapes.push(<img loading="lazy" key={i} alt="shape" src={`/assets/svg/${[shape, shading, color].toString()}.svg`} />);
  }

  return shapes;
};

const Card = ({ selected = false, config, onClick }: ICardProps) => {
  const className = cn("text-gray-900 py-2 px-2 bg-gray-200 rounded flex justify-center items-center", {
    // ring: selected,
    // "ring-offset-gray-800": selected,
    // "ring-yellow-300": selected,
    // "ring-offset-2": selected,
    "bg-cyan-600": selected,
    "text-white": selected,
  });

  return (
    <button onClick={onClick} className={className}>
      <div className="flex flex-col items-center">
        <img src={config.logo} width="30" />
        <div className="text-sm mt-2 font-medium">
          {config.name}
        </div>
      </div>
      
      {/* {createImages(config)} */}
    </button>
  );
};

export default Card;
