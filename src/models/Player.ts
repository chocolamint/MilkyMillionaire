import Card from "./Card";
import Character from "./Character";
import Rule from "./Rule";
import Stack from "./Stack";
import { combination } from "./Utils";
import { Turn } from "./Turn";

export default class Player extends Character {

    public waitingForNextGame: boolean;
    public isTrading: boolean;
    private _resolveNextGame: () => void;
    private _resolveTrading: (cards: Card[]) => void;
    private _turn: Turn | null;

    constructor(name: string) {
        super(name);
        this.waitingForNextGame = false;
        this.isTrading = false;
    }

    turnCore(turn: Turn) {
        this._turn = turn;
        super.turnCore(turn);
    }
    canStage(card: Card) {

        if (this._turn == null) throw "Invalid call: Player#canStage.";

        const stagings = this.stagings();
        const top = this._turn.stack.top();
        if (stagings.length == 0) {
            if (top == null) return true;
            const discardables = combination(this.cards, top.length)
                .filter(xs => this._turn.canDiscard(xs));
            return discardables.some(xs => xs.indexOf(card) != -1);
        } else {
            return (
                this._turn.canDiscard(stagings.concat(card)) ||
                stagings.indexOf(card) != -1
            );
        }
    }
    canDiscard() {
        if (this._turn == null) return false;
        return this._turn.canDiscard(this.stagings());
    }
    isUnnecessaryCardSelecting() {
        return this.isTrading && this.rank >= 4;
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
    }
    pass() {
        this.stagings().forEach(x => x.isStaged = false);
        super.pass();
    }
    nextGame() {
        return new Promise<void>(resolve => {
            this.waitingForNextGame = true;
            this._resolveNextGame = resolve;
        });
    }
    async goToNextGame() {
        this.waitingForNextGame = false;
        await super.nextGame();
        this._resolveNextGame();
    }
    giveCards(rule: Rule) {
        return new Promise<Card[]>(resolve => {
            this.isTrading = true;
            if (this.rank <= 2) {
                setTimeout(async () => {
                    this.isTrading = false;
                    const cards = await super.giveCards(rule);
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
            this.trashCard(card);
        }
        this.isTrading = false;
        setTimeout(() => {
            this._resolveTrading(stagings);
        }, 500);
    }
}