import Player from "@/models/Player";
import Rule from "@/models/Rule";
import { NormalCard, Card } from "@/models/Card";
import { Turn } from "@/models/Turn";
import Stack from "@/models/Stack";
import CardSet from "@/models/CardSet";
import { expect } from "chai";
import PlayerComponent from "@/components/Player/Player";

describe("Player.ts", () => {

    it("should be able to stage card only if can discard.", () => {

        const { player, deck } = situation({
            stack: [
                [new NormalCard("♥", 7)],
                [new NormalCard("♥", 5)],
            ],
            deck: [
                new NormalCard("♠", 6), new NormalCard("♠", 7), new NormalCard("♠", 8),
            ],
        });

        const actuals = deck.map(x => player.canStage(x));

        expect(actuals).to.deep.equal([false, false, true]);
    });

    it("can stage card.", () => {

        const { player, deck } = situation({
            stack: [
                [new NormalCard("♥", 7)],
                [new NormalCard("♥", 5)],
            ],
            deck: [
                new NormalCard("♠", 6), new NormalCard("♠", 7), new NormalCard("♠", 8),
            ],
        });

        expect(deck[2].isStaged).to.equal(false);

        player.toggleCardStaging(deck[2]);

        expect(deck[2].isStaged).to.equal(true);

        player.toggleCardStaging(deck[2]);

        expect(deck[2].isStaged).to.equal(false);
    });

    function situation(s: { stack: Card[][], deck: ReadonlyArray<Card> }) {

        const rule = new Rule();

        const stack = new Stack();
        for (const cards of s.stack) {
            stack.cards.unshift(new CardSet(cards, "unknown"));
        }

        const player = new Player("unknown");
        player.isMyTurn = true;
        player.currentTurn = new Turn(stack, rule, 1);
        for (const card of s.deck) {
            player.deal(card);
        }

        const component = new PlayerComponent();
        component.player = player;
        component.rule = rule;

        return { player: component, deck: s.deck };
    }
});