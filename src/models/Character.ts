import Card from "./Card";
import { TurnResult, Turn } from "./Turn";
import { sleep, ILogger } from "./Utils";
import Stack from "./Stack";
import Deck from "./Deck";
import Rule from "./Rule";

export default class Character {

    public name: string;
    public isMyTurn: boolean;
    public isCleared: boolean;
    public rank: number;
    public nextRank: number;
    public isGameEnd: boolean;
    public logger: ILogger;
    private _deck = new Deck();
    private _resolveTurn: (result: TurnResult) => void;

    constructor(name: string) {
        this.name = name;
        this.isMyTurn = false;
        this.isCleared = false;
        this.rank = 3;
        this.nextRank = 3;
        this.isGameEnd = false;
    }
    get cards(): ReadonlyArray<Card> {
        return this._deck.cards;
    }
    // TODO: 派生型がデッキにアクセスできないのが悪いと思う。継承をやめたい
    get restCount(): number {
        return this._deck.cards.length;
    }
    trashCard(card: Card) {
        this._deck.remove(card);
    }
    deal(card: Card) {
        this._deck.add(card);
    }
    turn(turn: Turn) {
        return new Promise<TurnResult>(resolve => {
            this.say(`私のターンです！`);
            this.isMyTurn = true;
            this._resolveTurn = resolve;
            this.turnCore(turn);
        });
    }
    turnCore(turn: Turn) {

    }
    private turnEnd(result: TurnResult) {
        this.isMyTurn = false;
        this.say(`ターン終了です！`);
        if (this._deck.isEmpty) {
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
            this._deck.remove(card);
        }
        this.turnEnd({ action: "discard", cards: cards });
    }
    endGame() {
        this._deck.clear();
        this.isMyTurn = false;
        this.isCleared = false;
        this.isGameEnd = true;
    }
    nextGame() {
        this.rank = this.nextRank;
        this.isGameEnd = false;
        return Promise.resolve();
    }
    say(message: string) {
        this.logger.log(`%c${this.name}: ${message}`, this);
    }
    async giveCards(rule: Rule) {
        if (this.rank == 3) {
            return [];
        } else {
            const strong = this.rank > 3;
            const count = Math.abs(this.rank - 3);
            const cards = this._deck.pick(rule, strong, count);
            this.say(`${cards.join(',')}を差し出します(Rank:${this.rank})`);
            return cards;
        }
    }
}
