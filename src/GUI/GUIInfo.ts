import { Vector2 } from "@babylonjs/core";
import { Direction } from "../Compositions/Transformable";

export type GUIBoxInfo = { objectType: ''; } | {
  objectType: 'variable';
  location: Vector2;
  direction: Direction;

  name: string;
  value: string;
  isKnown: boolean;
} | {
  objectType: 'decision';
  location: Vector2;
  direction: Direction;

  statement: string;
} | {
  objectType: 'direction';
  location: Vector2;
  direction: Direction;
}

export enum KeyGroup {
  NUMERIC,
  ALPHABETIC,
  ALPHANUMERIC,
  SYMBOLIC,
  NUMBOLIC,
  SYMBALPHANUMERIC,
  ALL
}

export function AllowKey(key: string, keyGroup: KeyGroup): boolean {
  if (keyGroup === KeyGroup.NUMERIC) {
    return isNumber(key);
  }

  if (keyGroup === KeyGroup.ALPHABETIC) {
    return isLetter(key);
  }

  if (keyGroup === KeyGroup.ALPHANUMERIC) {
    return isNumber(key) || isLetter(key);
  }

  if (keyGroup === KeyGroup.SYMBOLIC) {
    return isSymbol(key);
  }

  if (keyGroup === KeyGroup.NUMBOLIC) {
    return isSymbol(key) || isNumber(key);
  }

  if (keyGroup === KeyGroup.SYMBALPHANUMERIC) {
    return isNumber(key) || isLetter(key) || isSymbol(key);
  }

  return true;
}

export function CheckKeyGroup(key: string): KeyGroup {
  if (isNumber(key)) {
    return KeyGroup.NUMERIC;
  }

  if (isLetter(key)) {
    return KeyGroup.ALPHABETIC;
  }

  if (isSymbol(key)) {
    return KeyGroup.SYMBOLIC;
  }

  return KeyGroup.ALL;
}

export function CheckNumbolicExpression(word: string): boolean {
  for (let i = 0; i < word.length; i++) {
    if (!AllowKey(word[i], KeyGroup.NUMBOLIC)) {
      return false;
    }
  }

  return true;
}

export function CheckNumberExpresion(word: string): boolean {
  for (let i = 0; i < word.length; i++) {
    if (!AllowKey(word[i], KeyGroup.NUMERIC)) {
      return false;
    }
  }

  return true;
}

function isNumber(key: string): boolean {
  if (key >= '0' && key <= '9') {
    return true;
  }

  return false;
}

function isLetter(key: string): boolean {
  if (key >= 'a' && key <= 'z') {
    return true;
  }

  if (key >= 'A' && key <= 'Z') {
    return true;
  }

  return false;
}

function isSymbol(key: string): boolean {
  const characters = ['!', '%', '*', '(', ')', '-', '+', '=', '/', '<', '>', '|', '&' , ' '];

  if (characters.includes(key)) {
    return true;
  }

  return false;
}