import Player from "@/models/Player";
import Rule from "@/models/Rule";
import { NormalCard, Card, Joker } from "@/models/Card";
import { Turn } from "@/models/Turn";
import Stack from "@/models/Stack";
import CardSet from "@/models/CardSet";
import PlayerComponent from "@/components/Player/Player";

describe("Player.ts", () => {

    describe("when top is ♥7", () => {

        it("should be able to stage card.", () => {

            const { player, deck } = situation({
                stack: [
                    [new NormalCard("♥", 7)],
                    [new NormalCard("♥", 5)],
                ],
                deck: [
                    new NormalCard("♠", 6), new NormalCard("♠", 7), new NormalCard("♠", 8),
                ],
            });

            expect(deck[2].isStaged).toBe(false);

            player.toggleCardStaging(deck[2]);

            expect(deck[2].isStaged).toBe(true);

            player.toggleCardStaging(deck[2]);

            expect(deck[2].isStaged).toBe(false);
        });

        it("should be able to stage only higher cards.", () => {

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

            expect(actuals).toEqual([false, false, true]);
        });

        // TODO can not であるべきに思えるが、UI の処理分岐の都合上で現状こうしてしまっている…
        it("should be able to stage already staged card.", () => {

            const { player, deck } = situation({
                stack: [
                    [new NormalCard("♥", 7)],
                    [new NormalCard("♥", 5)],
                ],
                deck: [
                    new NormalCard("♠", 6), new NormalCard("♠", 7), new NormalCard("♠", 8),
                ],
            });

            expect(player.canStage(deck[2])).toBe(true);

            player.toggleCardStaging(deck[2]);

            expect(player.canStage(deck[2])).toBe(true);
        });

        it("should not be able to stage if another card is staged .", () => {

            const { player, deck } = situation({
                stack: [
                    [new NormalCard("♥", 7)],
                    [new NormalCard("♥", 5)],
                ],
                deck: [
                    new NormalCard("♠", 6), new NormalCard("♠", 9), new NormalCard("♠", 8),
                ],
            });

            expect(player.canStage(deck[1])).toBe(true);
            expect(player.canStage(deck[2])).toBe(true);

            player.toggleCardStaging(deck[1]);

            expect(player.canStage(deck[1])).toBe(true);
            expect(player.canStage(deck[2])).toBe(false);
        });
    });

    describe("when top is (♥7, ♦7)", () => {

        it("should be able to stage card until number of top cards.", () => {

            const { player, deck } = situation({
                stack: [
                    [new NormalCard("♥", 7), new NormalCard("♦", 7)],
                ],
                deck: [
                    new NormalCard("♠", 8), new NormalCard("♠", 8), new NormalCard("♠", 8),
                ],
            });

            player.toggleCardStaging(deck[0]);

            expect(player.canStage(deck[1])).toBe(true);
            expect(player.canStage(deck[2])).toBe(true);

            player.toggleCardStaging(deck[1]);

            expect(player.canStage(deck[2])).toBe(false);
        });

        it("should not be able to stage stupid card.", () => {

            const { player, deck } = situation({
                stack: [
                    [new NormalCard("♥", 7), new NormalCard("♦", 7)],
                ],
                deck: [
                    new NormalCard("♠", 8), new NormalCard("♠", 8), new NormalCard("♠", 9),
                ],
            });

            expect(player.canStage(deck[0])).toBe(true);
            expect(player.canStage(deck[1])).toBe(true);
            expect(player.canStage(deck[2])).toBe(false);
        });

        it("should be able to stage same rank card if another card is staged.", () => {

            const { player, deck } = situation({
                stack: [
                    [new NormalCard("♥", 7), new NormalCard("♦", 7)],
                ],
                deck: [
                    new NormalCard("♠", 8), new NormalCard("♠", 8), new NormalCard("♠", 9), new NormalCard("♠", 9),
                ],
            });

            expect(player.canStage(deck[1])).toBe(true);
            expect(player.canStage(deck[2])).toBe(true);

            player.toggleCardStaging(deck[0]);

            expect(player.canStage(deck[1])).toBe(true);
            expect(player.canStage(deck[2])).toBe(false);
        });
    });

    describe("when leader", () => {

        it("should not be able to stage any card.", () => {

            const { player, deck } = situation({
                stack: [],
                deck: [
                    new NormalCard("♠", 3), new NormalCard("♥", 3), new NormalCard("♠", 13), new NormalCard("♠", 2), new Joker(),
                ],
            });

            expect(player.canStage(deck[0])).toBe(true);
            expect(player.canStage(deck[1])).toBe(true);
            expect(player.canStage(deck[2])).toBe(true);
            expect(player.canStage(deck[3])).toBe(true);
            expect(player.canStage(deck[4])).toBe(true);

            player.toggleCardStaging(deck[1]);

            expect(player.canStage(deck[0])).toBe(true);
            expect(player.canStage(deck[2])).toBe(false);
        });
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