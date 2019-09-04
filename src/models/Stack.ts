import Card from "./Card";
import CardSet from "./CardSet";

export default class Stack {

    public cards: CardSet[];

    public constructor() {
        this.cards = [];
    }

    public push(cards: CardSet) {
        this.cards.push(cards);
    }
    
    public top(): Card[] | null {
        if (this.cards.length == 0) return null;
        return this.cards.slice(this.cards.length - 1, this.cards.length)[0].cards;
    }

    public clear() {
        this.cards.splice(0, this.cards.length);
    }
}