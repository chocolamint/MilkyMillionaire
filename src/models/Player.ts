import Card from "./Card";
import Character from "./Character";
import Rule from "./Rule";
import Stack from "./Stack";
import { combination } from "./Utils";

export default class Player extends Character {

    public waitingForNextGame: boolean;
    public isTrading: boolean;
    public rule: Rule;
    private _resolveNextGame: () => void;
    private _resolveTrading: (cards: Card[]) => void;
    private _stack: Stack;

    constructor(name: string, color: string, rule: Rule) {
        super(name, color);
        this.waitingForNextGame = false;
        this.isTrading = false;
        this.rule = rule;
    }

    turnCore(stack: Stack, turnCount: number) {
        this._stack = stack;
        super.turnCore(stack, turnCount);
    }
    canStage(card: Card) {

        const stagings = this.stagings();
        const top = this._stack.top();
        if (stagings.length == 0) {
            if (top == null) return true;
            const discardables = combination(this.cards, top.length)
                .filter(xs => this.rule.canDiscard(this._stack, xs));
            return discardables.some(xs => xs.indexOf(card) != -1);
        } else {
            return (
                this.rule.canDiscard(this._stack, stagings.concat(card)) ||
                stagings.indexOf(card) != -1
            );
        }
    }
    canDiscard() {
        return this.rule.canDiscard(this._stack, this.stagings());
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