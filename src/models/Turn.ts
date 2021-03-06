import { Card } from "./Card";
import Stack from "./Stack";
import Rule from "./Rule";

export type TurnResult = Pass | Discard;

interface Pass {
    action: "pass";
}

interface Discard {
    action: "discard";
    cards: Card[];
}

export class Turn {

    public constructor(public stack: Stack, public rule: Rule, public turnCount: number) {

    }

    public canDiscard(cards: Card[]) {
        return this.rule.canDiscard(this.stack, cards);
    }
}