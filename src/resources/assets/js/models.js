class Field {
    constructor() {
        this.cards = [];
        this._passCount = 0;
        this._lastDiscard = null;
    }
    pass(character) {

        console.log(`${character.name}がパスしました`);

        this._passCount++;
        if (this._passCount == 5) {
            this.cards.splice(0, this.cards.length);
        }
    }
    discard(character, cards) {

        console.log(`${character.name}が${cards.map(x => x.toString()).join(',')}を捨てました`);

        this._lastDiscard = character;
        this._passCount = 0;

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
            this._resolveTurn = resolve;
            console.log(`${this.name}のターン`);
            this.isMyTurn = true;
            this.turnCore();
        });
    }
    turnCore() {
        
    }
    turnEnd() {
        this.isMyTurn = false;
        console.log(`${this.name}のターン終わり`);
        this._resolveTurn();
    }
    pass() {
        field.pass(this);
        this.turnEnd();
    }
    discard(cards) {
        for (const card of cards) {
            const index = this.cards.findIndex(x => x == card);
            this.cards.splice(index, 1);
        }
        field.discard(this, cards);
        this.turnEnd();
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
}

export class Computer extends Character {
    turnCore(){
        setTimeout(() => {
            const discardable = this.cards.filter(x => field.canDiscard([x]))[0];
            console.dir(discardable);
            if (discardable == null) {
                this.pass();
            } else {
                this.discard([discardable]);
            }
        }, 500);
    }
 }

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
    toString() {
        if (this.isJoker) return 'Joker';
        return this.suit +
            (this.rank == 1 ? 'A' : this.rank == 11 ? 'J' : this.rank == 12 ? 'Q' : this.rank == 13 ? 'K' : this.rank);
    }
}
