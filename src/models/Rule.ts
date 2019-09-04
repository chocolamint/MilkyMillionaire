import Stack from "./Stack";
import Card from "./Card";

export default class Rule {

    public canDiscard(stack: Stack, cards: Card[]) {
        if (cards.length == 0) return false;
        let c: Card;
        if (cards.every(x => x.isJoker)) {
            c = cards[0];
        } else {
            c = cards.filter(x => !x.isJoker)[0];
            if (cards.some(x => !x.isJoker && c.rank != x.rank)) return false;
        }
        const top = stack.top();
        if (top == null) return true;
        if (Card.compareRank(c, top[0]) <= 0) return false;
        return cards.length == top.length;
    }
}