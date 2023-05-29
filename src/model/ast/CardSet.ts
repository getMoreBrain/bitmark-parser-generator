import { BitContent } from '../../parser/bitmark/pegHelpers/BitmarkPegParserTypes';

export interface UnparsedCardSet {
  cards: UnparsedCard[];
}

export interface UnparsedCard {
  sides: UnparsedCardSide[];
}

export interface UnparsedCardSide {
  variants: UnparsedCardContent[];
}

type UnparsedCardContent = string;

export interface CardSet {
  cards: Card[];
}

export interface Card {
  sides: CardSide[];
}

export interface CardSide {
  variants: CardContent[];
}

type CardContent = BitContent[];
