import Card from "./Card";
import Field from "./Field";
import { TurnResult } from "./TurnResult";
import { sleep } from "./Utils";
import Stack from "./Stack";

export default class Character {

    public name: string;
    public cards: Card[];
    public isMyTurn: boolean;
    public isCleared: boolean;
    public color: string;
    public rank: number;
    public nextRank: number;
    public isGameEnd: boolean;
    private _resolveTurn: (result: TurnResult) => void;

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
    turn(stack: Stack, turnCount: number) {
        return new Promise<TurnResult>(resolve => {
            this.say(`私のターンです！`);
            this.isMyTurn = true;
            this._resolveTurn = resolve;
            this.turnCore(stack, turnCount);
        });
    }
    turnCore(stack: Stack, turnCount: number) {

    }
    private turnEnd(result: TurnResult) {
        this.isMyTurn = false;
        this.say(`ターン終了です！`);
        if (this.cards.length == 0) {
            this.isCleared = true;
            this.say(`あがりです！`);
        }
        this._resolveTurn(result);
    }
    pass() {
        sleep(0);
        this.turnEnd({ action: "pass" });
    }
    discard(cards: Card[]) {
        for (const card of cards) {
            this.cards.splice(this.cards.indexOf(card), 1);
        }
        this.turnEnd({ action: "discard", cards: cards });
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
