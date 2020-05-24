/* tslint:disable */
/* eslint-disable */
/**
*/
export function greet(): void;
/**
*/
export enum Cell {
  Dead,
  Alive,
}
/**
*/
export class Universe {
  free(): void;
/**
*/
  tick(): void;
/**
* @returns {Universe} 
*/
  static new(): Universe;
/**
* @returns {string} 
*/
  render(): string;
/**
* @returns {number} 
*/
  get_width(): number;
/**
* @returns {number} 
*/
  get_height(): number;
/**
* @returns {number} 
*/
  cells(): number;
}
