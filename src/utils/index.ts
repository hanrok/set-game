export const generateCards = () => {
  const cards = [];

  for (let i = 1; i <= 3; i++) { // Shape property
    for (let j = 1; j <= 3; j++) { // Color property
      for (let k = 1; k <= 3; k++) { // Number property
        for (let l = 1; l <= 3; l++) { // Shading property
          cards.push([i, j, k, l]);
        }
      }
    }
  }

  return cards;
};

export const setCardsOnTable = (cards: number[][]) => {
  const newArray = [...cards];
  const preGameCards: number[][] = [];

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      if (newArray.length > 0) {
        const card = newArray.pop() as number[];
        preGameCards.push(card);
      }
    }
  }

  return { deck: newArray, preGameCards };
}

export const shuffleDeck = (cards: number[][]) => {
  const newArray = [...cards];

  for (let index = 0; index < newArray.length; index++) {
    let swapIndex = index + Math.floor(Math.random() * (newArray.length - index));
    let tmp = newArray[index];
    newArray[index] = newArray[swapIndex];
    newArray[swapIndex] = tmp;
  }

  return newArray;
}