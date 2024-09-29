import { CardType } from "@/models/card";

// TODO: understand if we want to give more feature than just the category of the products
// export const isSet = (features: number[]): boolean => arrSum(features) === 0;

export const isSet = (cards: CardType[]): boolean => cards.every(c => c.category === cards[0].category);
export const arrSum = (arr: number[]): number => arr.reduce((a: number, b: number) => a + b, 0);