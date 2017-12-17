class Field {
    constructor() {
        this.cards = [];
    }
    discard(cards) {
        cards.id = 'discards-' + String(discardId++);
        for (const card of cards) {
            card.id += '-discard';
        }
        this.cards.push(cards);
    }
    canDiscard(cards) {
        if (cards.length < 1) return false;
        var c = cards[0];
        if (cards.some(x => !x.isJoker && c.rank != x.rank)) return false;
        const top = this.top();
        if (Card.compareRank(c, top[0]) <= 0) return false;
        return cards.length == top.length;
    }
    top() {
        if (this.cards.length == 0) return null;
        return this.cards.slice(this.cards.length - 1, this.cards.length)[0];
    }
}

export const field = new Field();

let discardId = 0;

export class Character {
    constructor(name) {
        this.name = name;
        this.cards = [];
        this.isMyTurn = false;
    }
    turn() {
        return new Promise(resolve => {
            console.log(`${this.name}のターン`);
            this.isMyTurn = true;
            setTimeout(() => {
                const discardable = this.cards.filter(x => field.canDiscard([x]))[0];
                console.dir(discardable);
                field.discard([discardable]);
                this.isMyTurn = false;
                console.log(`${this.name}のターン終わり`);
                resolve();
            }, 500);
        });
    }
    discard(cards) {
        for (const card of cards) {
            const index = this.cards.findIndex(x => x == card);
            this.cards.splice(index, 1);
        }
        field.discard(cards);
    }
}

export class Player extends Character {
    turn() {
        this.isMyTurn = true;
        return new Promise(resolve => {
            this._resolveTurn = resolve;
        });
    }
    stagings() {
        return this.cards.filter(x => x.isStaged);
    }
    discardStaging() {
        var stagings = this.stagings();
        this.discard(stagings);
    }
    discard(cards) {
        super.discard(cards);
        this._resolveTurn();
    }
}

export class Computer extends Character { }

export class Card {
    constructor(id, suit, rank, isJoker) {
        this.id = id;
        this.suit = suit;
        this.rank = rank;
        this.isJoker = Boolean(isJoker);
        this.isStaged = false;
    }
    /**
     * @param {Card} a
     * @param {Card} b
     */
    static compareSort(a, b) {
        const temp = Card.compareRank(a, b);
        if (temp != 0) return temp;

        const suitRanks = {
            "♥": 0,
            "♦": 1,
            "♠": 2,
            "♣": 3
        };
        return suitRanks[a.suit] - suitRanks[b.suit];
    }
    /**
     * @param {Card} a
     * @param {Card} b
     */
    static compareRank(a, b) {
        if (!(a instanceof Card)) throw 'Not a card.';
        if (!(b instanceof Card)) throw 'Not a card.';

        if (a.isJoker && b.isJoker) return 0;
        if (a.isJoker) return 1;
        if (b.isJoker) return -1;
        const numberRanks = n => (n == 2 ? 15 : n == 1 ? 14 : n);
        return numberRanks(a.rank) - numberRanks(b.rank);
    }
}
