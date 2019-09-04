import Card from "./Card";
import Character from "./Character";
import Rule from "./Rule";

export default class Player extends Character {

    public waitingForNextGame: boolean;
    public isTrading: boolean;
    public rule: Rule;
    private _resolveNextGame: () => void;
    private _resolveTrading: (cards: Card[]) => void;

    constructor(name: string, color: string, rule: Rule) {
        super(name, color);
        this.waitingForNextGame = false;
        this.isTrading = false;
        this.rule = rule;
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