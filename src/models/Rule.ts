import Stack from "./Stack";
import Card from "./Card";

export default class Rule {
    
    public compareCard(a: Card, b: Card) {
        const temp = this.compareRank(a, b);
        if (temp != 0) return temp;
    
        const suitRanks: Record<string, number> = {
            "♥": 0,
            "♦": 1,
            "♠": 2,
            "♣": 3
        };
        return suitRanks[a.suit!] - suitRanks[b.suit!];
    }
    public compareRank(a: Card, b: Card) {
        if (!(a instanceof Card)) throw 'Not a card.';
        if (!(b instanceof Card)) throw 'Not a card.';
    
        if (a.isJoker && b.isJoker) return 0;
        if (a.isJoker) return 1;
        if (b.isJoker) return -1;
        return a.rankLevel() - b.rankLevel();
    }
    public sort(cards: Card[], strong: boolean) {
        const temp = [...cards];
        temp.sort((a, b) => this.compareRank(a, b) * (strong ? -1 : 1));
        return temp;
    }
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
        if (this.compareRank(c, top[0]) <= 0) return false;
        return cards.length == top.length;
    }
}