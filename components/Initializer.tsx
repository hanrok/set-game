"use client";

import SetGameContext from "./Context";
import GameBoard from "./GameBoard";

export default function Initializer() {
  return (
    <SetGameContext>
      <GameBoard />
    </SetGameContext>
  );
}
