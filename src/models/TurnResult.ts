import Card from "./Card";

export type TurnResult = Pass | Discard;

type Pass = {
    action: "pass"
};

type Discard = {
    action: "discard",
    cards: Card[]
};