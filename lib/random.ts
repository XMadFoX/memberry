/**
 * @param  {number} min inclusive
 * @param  {number} max exclusive
 * @returns random number
 */
export function getRandomIntMinMax(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
