export class ArrayEx {
    /**
     * @param {Number} n
     */
    static range(start, count) {
        return [...Array(count).keys()].map(x => start + x);
    }

    /**
     * @param {T[]} arr 
     * @returns {T[]}
    */
    static shuffle(arr) {
        var i, j, temp;
        arr = arr.slice();
        i = arr.length;
        if (i === 0) {
            return arr;
        }
        while (--i) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    static random(arr) {
        if (arr.length == 0) return void 0;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static flatMap(xs, f) {
        return xs.map(f).reduce((a, b) => a.concat(b));
    }

    /**
     * @param {T[]} xs 
     * @param {Number} k 
     */
    static combination(xs, k) {

        /**
         * @param {T[]} xs 
         * @param {Number} i 
         * @param {Number} k 
         */
        const temp = (xs, i, k) => {
            if (k == 0) {
                return xs.slice(i).map(x => [x]);
            }
            const ret = [];
            for (let j = i; j < xs.length; j++) {
                const ys = temp(xs, j + 1, k - 1);
                for (const y of ys) {
                    ret.push([xs[j]].concat(y));
                }
            }
            return ret;
        };
        return temp(xs, 0, k - 1);
    }
}

class Field {
    constructor() {
        this.cards = [];
        this._passCount = 0;
        this._lastDiscard = null;
    }
    pass(character) {

        console.log(`${character.name}がパスしました`);

        this._passCount++;
        console.log(`パス${this._passCount}連続`);
        if (this._passCount == 4) {

            console.log(`パスが4回続いたので最後にカードを捨てた${this._lastDiscard.name}が次の親になります`);
            this.cards.splice(0, this.cards.length);

            const lastDiscard = this._lastDiscard;
            this._lastDiscard = null;

            return lastDiscard;
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
        if (cards.length == 0) return false;
        let c;
        if (cards.every(x => x.isJoker)) {
            c = cards[0];
        }else {
            c = cards.filter(x => !x.isJoker)[0];
            if (cards.some(x => !x.isJoker && c.rank != x.rank)) return false;
        }
        const top = this.top();
        if (top == null) return true;
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
    turnEnd(nextDealer) {
        this.isMyTurn = false;
        console.log(`${this.name}のターン終わり`);
        this._resolveTurn(nextDealer);
    }
    pass() {
        const nextDealer = field.pass(this, this._resolveTurn);
        this.turnEnd(nextDealer);
    }
    discard(cards) {
        for (const card of cards) {
            const index = this.cards.findIndex(x => x == card);
            this.cards.splice(index, 1);
        }
        const nextDealer = field.discard(this, cards);
        this.turnEnd(nextDealer);
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
    turnCore() {

        setTimeout(() => {
            const top = field.top();
            let discardable;
            if (top != null) {
                const fieldCardCount = top.length;
                const discardables = ArrayEx.combination(this.cards, fieldCardCount).filter(x => field.canDiscard(x));
                console.log('捨てられるのは以下の組み合わせです');
                console.dir(discardables.map(x => x.join(',')));
                discardable = ArrayEx.random(discardables);
            } else {
                // TODO: 2枚以上を出すケースも用意
                const discardables = ArrayEx.flatMap(ArrayEx.range(1, 4), x => ArrayEx.combination(this.cards, x))
                    .filter(x => field.canDiscard(x));
                console.log('捨てられるのは以下の組み合わせです');
                console.dir(discardables.map(x => x.join(',')));
                discardable = ArrayEx.random(discardables);
            }
            if (discardable == null) {
                this.pass();
            } else {
                this.discard(discardable);
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
    static allCards() {
        const suits = ["♥", "♦", "♠", "♣"];
        const ranks = ArrayEx.range(1, 13);
        const cards = ArrayEx.flatMap(ranks, rank =>
            suits.map(suit => new Card(suit + "-" + rank, suit, rank))
        ).concat(
            new Card("joker1", null, null, true),
            new Card("joker2", null, null, true)
            );
        return cards;
    }
    toString() {
        if (this.isJoker) return 'Joker';
        return this.suit +
            (this.rank == 1 ? 'A' : this.rank == 11 ? 'J' : this.rank == 12 ? 'Q' : this.rank == 13 ? 'K' : this.rank);
    }
}
