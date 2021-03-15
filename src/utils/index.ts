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

// export const shuffleDeck = (cards) => {
//   // TODO
// }