import Card from "./Card";
import Stack from "./Stack";
import Rule from "./Rule";

export type TurnResult = Pass | Discard;

type Pass = {
    action: "pass"
};

type Discard = {
    action: "discard",
    cards: Card[]
};

export type TurnInfo = {
    stack: Stack;
    rule: Rule;
    turnCount: number
};