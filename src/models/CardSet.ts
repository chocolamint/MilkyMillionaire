import Card from "./Card";

export default class CardSet {

    public id: string;

    public constructor(public cards: Card[], public holder: string) {
        this.id = cards.reduce((acc, x) => `${acc}-${x.id}`, ``);
    }
}