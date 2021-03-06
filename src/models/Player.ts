import { Card } from "./Card";
import Character from "./Character";
import Rule from "./Rule";
import Stack from "./Stack";
import { combination, sleep } from "./Utils";
import { Turn } from "./Turn";

export default class Player extends Character {

    public waitingForNextGame: boolean;
    public isTrading: boolean;
    public currentTurn: Turn | null = null;
    private resolveNextGame?: () => void;
    private resolveTrading?: (cards: Card[]) => void;

    constructor(name: string) {
        super(name);
        this.waitingForNextGame = false;
        this.isTrading = false;
    }

    public turnCore(turn: Turn) {
        this.currentTurn = turn;
        super.turnCore(turn);
    }
    public nextGame() {
        return new Promise<void>(resolve => {
            this.waitingForNextGame = true;
            this.resolveNextGame = resolve;
        });
    }
    public async goToNextGame() {
        this.waitingForNextGame = false;
        await super.nextGame();
        this.resolveNextGame!();
    }
    public async giveCards(rule: Rule) {
        this.isTrading = true;
        if (this.rank <= 2) {
            await sleep(2200);
            this.isTrading = false;
            const cards = await super.giveCards(rule);
            return cards;
        } else if (this.rank == 3) {
            this.isTrading = false;
            return [];
        } else {
            return await new Promise<Card[]>(resolve => {
                this.resolveTrading = resolve;
            });
        }
    }
    public async give(cards: Card[]) {

        this.resolveTrading!(cards);
    }
}