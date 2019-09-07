import { Card } from "./Card";
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
    public logger?: ILogger;
    private deck = new Deck();
    private resolveTurn?: (result: TurnResult) => void;

    constructor(name: string) {
        this.name = name;
        this.isMyTurn = false;
        this.isCleared = false;
        this.rank = 3;
        this.nextRank = 3;
        this.isGameEnd = false;
    }
    public get cards(): ReadonlyArray<Card> {
        return this.deck.cards;
    }
    // TODO: 派生型がデッキにアクセスできないのが悪いと思う。継承をやめたい
    public get restCount(): number {
        return this.deck.cards.length;
    }
    public trashCard(card: Card) {
        this.deck.remove(card);
    }
    public deal(card: Card) {
        this.deck.add(card);
    }
    public turn(turn: Turn) {
        return new Promise<TurnResult>(resolve => {
            this.say(`私のターンです！`);
            this.isMyTurn = true;
            this.resolveTurn = resolve;
            this.turnCore(turn);
        });
    }
    // tslint:disable-next-line:no-empty
    public turnCore(turn: Turn) {

    }
    public pass() {
        sleep(0);
        this.turnEnd({ action: "pass" });
    }
    public discard(cards: Card[]) {
        for (const card of cards) {
            this.deck.remove(card);
        }
        this.turnEnd({ action: "discard", cards });
    }
    public endGame() {
        this.deck.clear();
        this.isMyTurn = false;
        this.isCleared = false;
        this.isGameEnd = true;
    }
    public nextGame() {
        this.rank = this.nextRank;
        this.isGameEnd = false;
        return Promise.resolve();
    }
    public say(message: string) {
        if (this.logger != null) {
            this.logger.log(`%c${this.name}: ${message}`, this);
        }
    }
    public async giveCards(rule: Rule) {
        if (this.rank == 3) {
            return [];
        } else {
            const strong = this.rank > 3;
            const count = Math.abs(this.rank - 3);
            const cards = this.deck.pick(rule, strong, count);
            this.say(`${cards.join(",")}を差し出します(Rank:${this.rank})`);
            return cards;
        }
    }
    private turnEnd(result: TurnResult) {
        this.isMyTurn = false;
        this.say(`ターン終了です！`);
        if (this.deck.isEmpty) {
            this.isCleared = true;
            this.say(`あがりです！`);
        }
        this.resolveTurn!(result);
    }
}
