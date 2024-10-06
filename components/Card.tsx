'use client'

import cn from "clsx";
import React from "react";
import { Bounce } from "react-awesome-reveal";
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

const Card = ({ config, onClick }: ICardProps) => {
  const className = cn("flex flex-col flex-grow text-gray-900 bg-gray-1200 rounded justify-center items-center", {
    "bg-gray-1200": !config.selected,
    // "ring-1": config.selected,
    // "ring-offset-cyan-700": config.selected,
    // "ring-offset-2": config.selected,
    "bg-pink-1200": config.selected,
    "text-white": config.selected,
  });

  return (
    <Bounce className="col-span-1 flex">
      <button onClick={onClick} className={className}>
        <div className="flex flex-col flex-grow justify-between items-center px-4 py-2">
          <div className="flex-grow flex flex-col justify-center">
            <img src={config.logo} width={80}/>
          </div>
          <div className="text-sm pt-2 font-medium">
            {/* {config.name} */}
            {config.category}
          </div>
        </div>
        
        {/* {createImages(config)} */}
      </button>
    </Bounce>
  );
};

export default Card;
