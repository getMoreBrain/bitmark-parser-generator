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
