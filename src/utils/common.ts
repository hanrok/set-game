export const isSet = (features: number[]): boolean => arrSum(features) == 0;
export const arrSum = (arr: number[]): number => arr.reduce((a: number, b: number) => a + b, 0);