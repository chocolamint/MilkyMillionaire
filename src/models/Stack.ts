import Card from "./Card";

export default class Stack {

    public cards: Card[][];
    private _discardId: number = 0;

    public constructor() {
        this.cards = [];
    }

    public push(cards: Card[], discardedBy: number) {
        // TODO: これはひどい
        (cards as any).discardedBy = discardedBy;
        // TODO: これはひどい
        (cards as any).id = 'discards-' + String(this._discardId++);
        for (const card of cards) {
            card.id += '-discard';
        }
        this.cards.push(cards);
    }
    
    public top(): Card[] | null {
        if (this.cards.length == 0) return null;
        return this.cards.slice(this.cards.length - 1, this.cards.length)[0];
    }

    public clear() {
        this.cards.splice(0, this.cards.length);
    }
}