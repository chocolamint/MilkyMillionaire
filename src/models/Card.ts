import _ from "lodash";

export default class Card {

    public id: string;
    public suit?: string;
    public rank?: number;
    public isJoker: boolean;
    public isStaged: boolean;

    constructor(id: string, suit?: string, rank?: number, isJoker?: boolean) {
        this.id = id;
        this.suit = suit;
        this.rank = rank;
        this.isJoker = Boolean(isJoker);
        this.isStaged = false;
    }
    
    rankLevel() {
        if (this.isJoker) 13;
        const n = this.rank!;
        return (n == 2 ? 12 : n == 1 ? 11 : n - 3);
    }
    static allCards() {
        const suits = ["♥", "♦", "♠", "♣"];
        const ranks = _.range(1, 14);
        const cards = ranks.flatMap(rank =>
            suits.map(suit => new Card(suit + "-" + rank, suit, rank))
        ).concat(
            new Card("joker1", undefined, undefined, true),
            new Card("joker2", undefined, undefined, true)
        );

        if (typeof document != 'undefined' && document && document.location && document.location.search) {
            if (~document.location.search.indexOf('debug')) {
                return _.shuffle(cards).slice(0, 15);
            }
        }
        return cards;
    }
    toString() {
        if (this.isJoker) return 'Joker';
        return this.suit! +
            (this.rank! == 1 ? 'A' : this.rank == 11 ? 'J' : this.rank == 12 ? 'Q' : this.rank == 13 ? 'K' : this.rank);
    }
}
