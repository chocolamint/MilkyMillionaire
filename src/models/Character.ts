import Card from "./Card";

// TODO 酷い循環参照
declare var field: any;

export default class Character {

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
