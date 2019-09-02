export class ArrayEx {
    
    static range(start: number, count: number): number[] {
        return [...Array(count).keys()].map(x => start + x);
    }

    static shuffle<T>(arr: T[]): T[] {
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

    static random<T>(arr: T[]): T {
        if (arr.length == 0) return void 0;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static flatMap<T, S>(xs: T[], f: (elem: T) => S[]): S[] {
        return xs.map(f).reduce((a, b) => a.concat(b));
    }

    static combination<T>(xs: T[], k: number): T[][] {

        const temp = (xs: T[], i: number, k: number): T[][] => {
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

export class Field {
    
    public cards: Card[][];
    private _computers: Computer[];
    private _player: Player;
    private _passCount: number;
    private _lastDiscard: Character;
    public messenger: Messenger;

    constructor(messenger: Messenger) {
        this.cards = [];
        this._passCount = 0;
        this._lastDiscard = null;
        this.messenger = messenger;
    }
    pass(character: Character) {

        console.log(`${character.name}がパスしました`);
    }
    discard(character: Character, cards: Card[]) {

        console.log(`${character.name}が${cards.map(x => x.toString()).join(',')}を捨てました`);

        this._lastDiscard = character;
        this._passCount = 0;

        // TODO: これはひどい
        (cards as any).discardedBy = this._computers.indexOf(character as any);
        // TODO: これはひどい
        (cards as any).id = 'discards-' + String(discardId++);
        for (const card of cards) {
            card.id += '-discard';
        }
        this.cards.push(cards);
    }
    canDiscard(cards: Card[]) {
        if (cards.length == 0) return false;
        let c: Card;
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
    top(): Card[] | null {
        if (this.cards.length == 0) return null;
        return this.cards.slice(this.cards.length - 1, this.cards.length)[0];
    }
    static deal(characters: Character[], cards: Card[]) {
        let i = 0;
        for (const card of ArrayEx.shuffle(cards)) {
            characters[i++ % 5].cards.push(card);
        }
    }
    async beginGame(characters: Character[], cards: Card[]) {

        this._computers = characters.filter(x => x instanceof Computer) as Computer[];
        this._player = characters.filter(x => x instanceof Player)[0] as Player;

        const doGame = async () => {

            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

            const ranking = [];

            Field.deal(characters, cards);

            //let i = 0;
            for (const character of characters) {
                character.cards.sort(Card.compareSort);
                //character.rank = ++i;
            }

            console.log('カードの交換を開始します');
            const tradings: Record<number, Card[]> = {};
            for (const character of characters) {
                tradings[character.rank] = await character.giveCards();
            }
            for (const character of characters) {
                for (const card of tradings[6 - character.rank]) {
                    character.cards.push(card);
                }
                character.cards.sort(Card.compareSort);
            }
            console.log('カードの交換を終了します');

            await messenger.show('ゲームスタート', 1000);

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
                        await delay(500);
                    }
                    if (nextDealer != null && character != nextDealer) continue;
                    nextDealer = null;
                    if (character.isCleared) {
                        console.log(`${character.name}はあがっているので飛ばします`);
                        continue;
                    }

                    await character.turn(turnCount);

                    if (character.isCleared) {
                        ranking.unshift(character);
                    }

                    isGameEnd = characters.filter(x => x.isCleared).length == 4;
                    if (isGameEnd) break;
                }
                if (isGameEnd) break;
                turnCount++;
            }
            this._lastDiscard = null;
            this._passCount = 0;
            this.cards.splice(0, this.cards.length);

            for (const character of characters) {
                // 早くあがったキャラクターほど後ろに入っており、最後のキャラクターは入っていないため -1 が返る
                // そのため +1 すると 1～5 になる
                character.nextRank = ranking.indexOf(character) + 2;
                character.endGame();
            }

            await messenger.show('ゲームセット', 1000);

            console.log('結果を発表してプレーヤーの確認待ち');
            await this._player.waitForNextGame();
            console.log('次のゲームを開始します');

            for (const character of characters) {
                character.nextGame();
            }
        };

        while (true) {
            await doGame();
        }
    }
}

export class Messenger {
    
    public isShown: boolean;
    public message: string;

    constructor() {
        this.isShown = false;
    }
    async show(message: string, ms: number): Promise<void> {
        this.message = message;
        this.isShown = true;
        console.log('isShown = true');
        return new Promise(resolve => {
            setTimeout(() => {
                this.isShown = false;
                console.log('isShown = false');
                resolve();
            }, ms);
        });
    }
}

export const messenger = new Messenger();

export const field = new Field(messenger);

let discardId = 0;

export class Character {

    public name: string;
    public cards: Card[];
    public isMyTurn: boolean;
    public isCleared: boolean;
    public color: string;
    public rank: number;
    public nextRank: number;
    public isGameEnd: boolean;
    private _resolveTurn: () => void;

    constructor(name: string, color: string) {
        this.name = name;
        this.cards = [];
        this.isMyTurn = false;
        this.isCleared = false;
        this.color = color;
        this.rank = 3;
        this.nextRank = 3;
        this.isGameEnd = false;
    }
    turn(turnCount: number) {
        return new Promise(resolve => {
            this.say(`私のターンです！`);
            this.isMyTurn = true;
            this._resolveTurn = resolve;
            this.turnCore(turnCount);
        });
    }
    turnCore(turnCount: number) {

    }
    turnEnd() {
        this.isMyTurn = false;
        this.say(`ターン終了です！`);
        if (this.cards.length == 0) {
            this.isCleared = true;
            this.say(`あがりです！`);
        }
        this._resolveTurn();
    }
    pass() {
        field.pass(this);
    }
    discard(cards: Card[]) {
        for (const card of cards) {
            this.cards.splice(this.cards.indexOf(card), 1);
        }
        field.discard(this, cards);
    }
    endGame() {
        this.cards.splice(0, this.cards.length);
        this.isMyTurn = false;
        this.isCleared = false;
        this.isGameEnd = true;
    }
    nextGame() {
        this.rank = this.nextRank;
        this.isGameEnd = false;
    }
    say(message: string) {
        console.log(`%c${this.name}: ${message}`, `color:${this.color}`);
    }
    giveCards() {
        return new Promise<Card[]>(resolve => {
            let cards: Card[];
            switch (this.rank) {
                case 1:
                    cards = this.cards.splice(this.cards.length - 2, 2);
                    break;
                case 2:
                    cards = this.cards.splice(this.cards.length - 1, 1);
                    break;
                case 3:
                    cards = [];
                    break;
                case 4:
                    cards = this.cards.splice(0, 1);
                    break;
                case 5:
                    cards = this.cards.splice(0, 2);
                    break;
            }
            if (cards.length) {
                this.say(`${cards.join(',')}を差し出します`);
            }
            resolve(cards);
        });
    }
}

export class Player extends Character {

    public waitingForNextGame: boolean;
    public isTrading: boolean;
    private _resolveNextGame: () => void;
    private _resolveTrading: (cards: Card[]) => void;

    constructor(name: string, color: string) {
        super(name, color);
        this.waitingForNextGame = false;
        this.isTrading = false;
    }
    stagings() {
        return this.cards.filter(x => x.isStaged);
    }
    discardStaging() {
        var stagings = this.stagings();
        for (const card of stagings) {
            card.isStaged = false;
        }
        this.discard(stagings);
        setTimeout(() => {
            this.turnEnd();
        }, 500);
    }
    pass() {
        this.stagings().forEach(x => x.isStaged = false);
        super.pass();
        this.turnEnd();
    }
    waitForNextGame() {
        return new Promise(resolve => {
            this.waitingForNextGame = true;
            this._resolveNextGame = resolve;
        });
    }
    goToNextGame() {
        this.waitingForNextGame = false;
        this._resolveNextGame();
    }
    giveCards() {
        return new Promise<Card[]>(resolve => {
            this.isTrading = true;
            if (this.rank <= 2) {
                setTimeout(() => {
                    this.isTrading = false;
                    const missingCount = 3 - this.rank;
                    const cards = this.cards.splice(this.cards.length - missingCount, missingCount);
                    this.say(`${cards.join(',')}を差し出します`);
                    resolve(cards);
                }, 2200);
            }
            if (this.rank == 3) {
                this.isTrading = false;
                resolve([]);
            }
            if (this.rank >= 4) {
                this._resolveTrading = resolve;
            }
        });
    }
    giveStagings() {
        const stagings = this.stagings();
        for (const card of stagings) {
            card.isStaged = false;
            const index = this.cards.indexOf(card);
            this.cards.splice(index, 1);
        }
        this.isTrading = false;
        setTimeout(() => {
            this._resolveTrading(stagings);
        }, 500);
    }
}

export class Computer extends Character {

    public passing: boolean;
    public image: string;

    constructor(name: string, color: string, image: string) {
        super(name, color);
        this.passing = false;
        this.image = image;
    }
    turnCore(turnCount: number) {

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
            this.pass();
        } else {
            this.discard(discardable);
        }

        setTimeout(() => {
            this.passing = false;
            this.turnEnd();
        }, 500);
    }
}

export class Card {

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
