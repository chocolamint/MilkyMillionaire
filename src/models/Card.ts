import _ from "lodash";
import { concat } from "./Utils";

export function allCards(): Card[] {
    const suits: Suit[] = ["♥", "♦", "♠", "♣"];
    const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const normalCards = ranks.flatMap(
        rank => suits.map(suit => new NormalCard(suit, rank))
    );
    const cards = concat(normalCards, [new Joker(true), new Joker(false)]);

    if (typeof document != 'undefined' && document && document.location && document.location.search) {
        if (~document.location.search.indexOf('debug')) {
            return _.shuffle(cards).slice(0, 15);
        }
    }
    return cards;
}

type Suit = "♥" | "♦" | "♠" | "♣";
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type Card = NormalCard | Joker;

export class NormalCard {

    public id: string;
    public isJoker: false = false;
    public isStaged = false;

    public constructor(public suit: Suit, public rank: Rank) {
        this.id = suit + rank;
    }

    toString() {
        const rankString = (this.rank == 1 ? 'A' : this.rank == 11 ? 'J' : this.rank == 12 ? 'Q' : this.rank == 13 ? 'K' : this.rank);
        return this.suit + rankString;
    }
}

export class Joker {

    public id: string;
    public isJoker: true = true;
    public isStaged = false;

    public constructor(public isPrimary: boolean) {
        this.id = `Joker-${isPrimary ? 1 : 2}`;
    }

    toString() {
        return this.id;
    }
}
