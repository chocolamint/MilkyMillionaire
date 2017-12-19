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
        } else {
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
    notifyClear(character) {

    }
    /**
     * @param {Character[]} characters  
     * @param {Card[]} cards
    */
    static deal(characters, cards) {
        let i = 0;
        for (const card of ArrayEx.shuffle(cards)) {
            characters[i++ % 5].cards.push(card);
        }
    }
    async beginGame(characters, cards) {

        const doGame = async () => {

            Field.deal(characters, cards);

            for (const character of characters) {
                character.cards.sort(Card.compareSort);
            }

            let nextDealer = ArrayEx.random(characters);
            console.log(`${nextDealer.name}の親ではじめます`);
            let turnCount = 0;
            let isGameEnd = false;
            while (true) {
                for (const character of characters) {
                    if (this._lastDiscard == character) {
                        console.log(`最後にカードを捨てた${this._lastDiscard.name}の番が回ってきたので次の親になります`);
                        this.cards.splice(0, this.cards.length);
                        this._lastDiscard = null;
                    }
                    if (nextDealer != null && character != nextDealer) continue;
                    nextDealer = null;
                    if (character.isCleared) {
                        console.log(`${character.name}はあがっているので飛ばします`);
                        continue;
                    }

                    await character.turn(turnCount);

                    isGameEnd = characters.filter(x => x.isCleared).length == 4;
                    if (isGameEnd) break;
                }
                if (isGameEnd) break;
                turnCount++;
            }
            this._lastDiscard = null;
            this._passCount = 0;
        };

        while (true) {
            await doGame();
            console.log('全員あがったので次のゲームへ進みます');
            for (const character of characters) {
                character.endGame();
            }
        }
    }
}

export const field = new Field();

let discardId = 0;

export class Character {
    constructor(name, color) {
        this.name = name;
        this.cards = [];
        this.isMyTurn = false;
        this.isCleared = false;
        this.color = color;
        this.rank = 3;
    }
    turn(turnCount) {
        return new Promise(resolve => {
            this._resolveTurn = resolve;
            this.say(`私のターンです！`);
            this.isMyTurn = true;
            this.turnCore(turnCount);
        });
    }
    turnCore(turnCount) {

    }
    turnEnd(nextDealer) {
        this.isMyTurn = false;
        this.say(`ターン終了です！`);
        if (this.cards.length == 0) {
            this.isCleared = true;
            this.say(`あがりです！`);
            field.notifyClear(this);
        }
        this._resolveTurn(nextDealer);
    }
    pass() {
        field.pass(this, this._resolveTurn);
        this.turnEnd();
    }
    discard(cards) {
        for (const card of cards) {
            this.cards.splice(this.cards.indexOf(card), 1);
        }
        field.discard(this, cards);
        this.turnEnd();
    }
    endGame() {
        this.cards.splice(0, this.cards.length);
        this.isMyTurn = false;
        this.isCleared = false;
    }
    say(message) {
        console.log(`%c${this.name}: ${message}`, `color:${this.color}`);
    }
}

export class Player extends Character {
    stagings() {
        return this.cards.filter(x => x.isStaged);
    }
    discardStaging() {
        var stagings = this.stagings();
        for (const card of stagings) {
            card.isStaged = false;
        }
        this.discard(stagings);
    }
    pass() {
        this.stagings().forEach(x => x.isStaged = false);
        super.pass();
    }
}

export class Computer extends Character {
    constructor(name, color, image) {
        super(name, color);
        this.passing = false;
        this.image = image;
    }
    turnCore(turnCount) {

        const top = field.top();
        let discardable;
        if (top != null) {
            const fieldCardCount = top.length;
            const discardables = ArrayEx.combination(this.cards, fieldCardCount).filter(x => field.canDiscard(x));
            this.say(`捨てられるのは... ${discardables.length ? discardables.map(x => x.join('')).join(', ') : 'ないですね...'}`);
            let strategicPass = false;
            if (discardables.length != 0) {
                // ターンが早くてかつ捨てないといけないカードのランクが高いほどパスしやすくする
                const turnRatio = Math.max((- (turnCount + 1) + 10) / 10, 0);
                // TODO: 実際に捨てないといけないカードのランクの高さでパスしやすさを決めたいが、弱いものほど捨てやすいロジックになっていないと意味がないのでまたあとで
                const fieldRank = top.filter(x => !x.isJoker)[0].rankLevel();
                const passRatio = turnRatio * (fieldRank * fieldRank / 169);
                this.say(`${turnCount + 1}ターン目で${fieldRank}という高さ…パスしたさは${Math.round(passRatio * 100)}%くらいかな...`)
                if (Math.random() < passRatio) {
                    strategicPass = true;
                    this.say(`戦略的パスします`);
                }
            }
            // TODO: 弱いものほど捨てやすくしたい
            discardable = strategicPass ? null : ArrayEx.random(discardables);

        } else {
            const discardables = ArrayEx.flatMap(ArrayEx.range(1, 4), x => ArrayEx.combination(this.cards, x))
                .filter(x => field.canDiscard(x));
            this.say(`捨てられるのは... ${discardables.map(x => x.join('')).join(', ')}`);
            // TODO: 弱いものほど捨てやすくしたい
            discardable = ArrayEx.random(discardables);
        }

        if (discardable == null) {
            this.passing = true;
        }

        setTimeout(() => {
            if (discardable == null) {
                this.passing = false;
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
        return cards;
    }
    toString() {
        if (this.isJoker) return 'Joker';
        return this.suit +
            (this.rank == 1 ? 'A' : this.rank == 11 ? 'J' : this.rank == 12 ? 'Q' : this.rank == 13 ? 'K' : this.rank);
    }
}
