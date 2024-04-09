import { arrSum, isSet } from "./common";

export const generateCards = () => {
  const cards = [];

  for (let i = 1; i <= 3; i++) {
    // Shape property
    for (let j = 1; j <= 3; j++) {
      // Color property
      for (let k = 1; k <= 3; k++) {
        // Number property
        for (let l = 1; l <= 3; l++) {
          // Shading property
          cards.push([i, j, k, l]);
        }
      }
    }
  }

  return cards;
};

export const setCardsOnTable = (cards: number[][]) => {
  const preGameCards: number[][] = [];

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      if (cards.length > 0) {
        const card = cards.pop() as number[];
        preGameCards.push(card);
      }
    }
  }

  return { deck: cards, preGameCards };
};

export const shuffleDeck = (cards: number[][]) => {
  for (let index = 0; index < cards.length; index++) {
    let swapIndex = index + Math.floor(Math.random() * (cards.length - index));
    let tmp = cards[index];
    cards[index] = cards[swapIndex];
    cards[swapIndex] = tmp;
  }

  return cards;
};

const getFeatures = (possibleSet: number[][]) => {
  const color: number[] = [];
  const number: number[] = [];
  const shape: number[] = [];
  const shading: number[] = [];

  possibleSet.forEach((element) => {
    color.push(element[0]);
    number.push(element[1]);
    shape.push(element[2]);
    shading.push(element[3]);
  });

  return [arrSum(color) % 3, arrSum(number) % 3, arrSum(shape) % 3, arrSum(shading) % 3];
};

export const validatePossibleSet = (selectedSet: number[], cardsOnBoard: number[][]) => {
  const cards = selectedSet.map((index) => cardsOnBoard[index]);
  return isSet(getFeatures(cards));
};

export const countSets = (cards: number[][]) => {
  let size = 0;
  const sets = [];

  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        const isValidSet = isSet(getFeatures([cards[i], cards[j], cards[k]]));
        if (isValidSet) {
          size += 1;
          sets.push([cards[i], cards[j], cards[k]]);
        }
      }
    }
  }

  return { size, sets };
};
