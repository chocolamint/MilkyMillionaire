import { Card } from "./Card";
import _ from "lodash";
import Rule from "./Rule";
import { filterNotNull } from "./Utils";


export default class Deck {

    private _cards: Card[] = [];

    public get cards(): ReadonlyArray<Card> {
        return this._cards;
    }
    public get isEmpty() {
        return this._cards.length == 0;
    }
    public add(card: Card) {
        this._cards.push(card);
    }
    public remove(card: Card): Card | null {
        const index = this._cards.indexOf(card);
        if (index < 0) return null;
        return this._cards.splice(index, 1)[0];
    }
    public pick(rule: Rule, strong: boolean, count: number) {
        const sorted = rule.sort(this._cards, !strong);
        const cards = _.take(sorted, count).map(x => this.remove(x));
        return filterNotNull(cards);
    }
    public clear() {
        this._cards.splice(0, this._cards.length);
    }
}