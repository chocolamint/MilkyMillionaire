import ArrayEx from "./ArrayEx";

export default class Card {

    public id: string;
    public suit: string;
    public rank: number;
    public isJoker: boolean;
    public isStaged: boolean;

    constructor(id: string, suit: string, rank: number, isJoker?: boolean) {
        this.id = id;
        this.suit = suit;
        this.rank = rank;
        this.isJoker = Boolean(isJoker);
        this.isStaged = false;
    }
    static compareSort(a: Card, b: Card) {
        const temp = Card.compareRank(a, b);
        if (temp != 0) return temp;

        const suitRanks: Record<string, number> = {
            "♥": 0,
            "♦": 1,
            "♠": 2,
            "♣": 3
        };
        return suitRanks[a.suit] - suitRanks[b.suit];
    }
    static compareRank(a: Card, b: Card) {
        if (!(a instanceof Card)) throw 'Not a card.';
        if (!(b instanceof Card)) throw 'Not a card.';

        if (a.isJoker && b.isJoker) return 0;
        if (a.isJoker) return 1;
        if (b.isJoker) return -1;
        return a.rankLevel() - b.rankLevel();
    }
    rankLevel() {
        if (this.isJoker) 13;
        const n = this.rank;
        return (n == 2 ? 12 : n == 1 ? 11 : n - 3);
    }
    static allCards() {
        const suits = ["♥", "♦", "♠", "♣"];
        const ranks = ArrayEx.range(1, 13);
        const cards = ArrayEx.flatMap(ranks, rank =>
            suits.map(suit => new Card(suit + "-" + rank, suit, rank))
        ).concat(
            new Card("joker1", null, null, true),
            new Card("joker2", null, null, true)
            );

        if (typeof document != 'undefined' && document && document.location && document.location.search) {
            if (~document.location.search.indexOf('debug')) {
                return ArrayEx.shuffle(cards).slice(0, 15);
            }
        }
        return cards;
    }
    toString() {
        if (this.isJoker) return 'Joker';
        return this.suit +
            (this.rank == 1 ? 'A' : this.rank == 11 ? 'J' : this.rank == 12 ? 'Q' : this.rank == 13 ? 'K' : this.rank);
    }
}
