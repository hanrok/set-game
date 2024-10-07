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
  const containerClassName = cn("flex flex-col justify-center rounded", {
    "m-1": config.selected,
    "border-4": config.selected,
    "bg-gray-1200": !config.selected,
    "bg-gray-1300": config.selected,
  });

  return (
    <Bounce className={containerClassName} key={config.name}>
      <button onClick={onClick} className="flex flex-col flex-grow justify-center text-gray-900 rounded overflow-hidden items-stretch">
        <div className="flex flex-col flex-grow justify-between items-center px-4 py-2">
          <div className="flex-grow w-full h-full bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url('${config.logo}')` }}>
          </div>
          <div className="text-sm pt-2 font-medium">
            {config.name}
          </div>
        </div>
      </button>
    </Bounce>
  );
};

export default Card;
