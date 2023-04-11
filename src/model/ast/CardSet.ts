import { Choice, Heading, Matrix, Pair, Question, Quiz, Statement, Response } from './Nodes';

export interface CardSet {
  cards: Card[];
}

export interface Card {
  sides: CardSide[];
}

export interface CardSide {
  variants: CardContent[];
}

type CardContent = string;

export interface BitSpecificCards {
  sampleSolutions?: string | string[];
  elements?: string[];
  statements?: Statement[];
  responses?: Response[];
  quizzes?: Quiz[];
  heading?: Heading;
  pairs?: Pair[];
  matrix?: Matrix[];
  choices?: Choice[];
  questions?: Question[];
}
