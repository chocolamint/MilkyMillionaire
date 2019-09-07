import { NormalCard, Joker, Card } from "@/models/Card";
import Rule from "@/models/Rule";
import Stack from "@/models/Stack";
import CardSet from "@/models/CardSet";

describe("Rule.ts", () => {

    describe("sort method", () => {

        it("should sort ascending if `strong` is false.", () => {
            const cards = [
                new NormalCard("♥", 1),
                new NormalCard("♠", 2),
                new Joker(true),
                new NormalCard("♠", 3),
                new NormalCard("♦", 10),
                new NormalCard("♣", 13),
            ];
            const rule = new Rule();

            const sorted = rule.sort(cards, false);

            expect(sorted).toEqual([
                new NormalCard("♠", 3),
                new NormalCard("♦", 10),
                new NormalCard("♣", 13),
                new NormalCard("♥", 1),
                new NormalCard("♠", 2),
                new Joker(true),
            ]);
        });

        it("should sort descending if `strong` is true.", () => {
            const cards = [
                new NormalCard("♥", 1),
                new NormalCard("♠", 2),
                new Joker(true),
                new NormalCard("♠", 3),
                new NormalCard("♦", 10),
                new NormalCard("♣", 13),
            ];
            const rule = new Rule();

            const sorted = rule.sort(cards, true);

            expect(sorted).toEqual([
                new Joker(true),
                new NormalCard("♠", 2),
                new NormalCard("♥", 1),
                new NormalCard("♣", 13),
                new NormalCard("♦", 10),
                new NormalCard("♠", 3),
            ]);
        });

        it("sorts by suit if same rank.", () => {

            const cards = [
                new NormalCard("♠", 7),
                new NormalCard("♥", 7),
                new NormalCard("♦", 7),
                new NormalCard("♣", 7),
                new NormalCard("♠", 6),
                new NormalCard("♥", 8),
            ];
            const rule = new Rule();

            const sortedAsc = rule.sort(cards, false);
            const sortedDesc = rule.sort(cards, true);

            expect(sortedAsc).toEqual([
                new NormalCard("♠", 6),
                new NormalCard("♥", 7),
                new NormalCard("♦", 7),
                new NormalCard("♠", 7),
                new NormalCard("♣", 7),
                new NormalCard("♥", 8),
            ]);
            expect(sortedDesc).toEqual([
                new NormalCard("♥", 8),
                new NormalCard("♥", 7),
                new NormalCard("♦", 7),
                new NormalCard("♠", 7),
                new NormalCard("♣", 7),
                new NormalCard("♠", 6),
            ]);
        });
    });

    describe("canDiscard method", () => {

        describe("when top is ♥7", () => {
            it("should return true only if higher than stack top.", () => {

                const { canDiscard } = situation({
                    stack: [
                        [new NormalCard("♥", 7)],
                        [new NormalCard("♠", 5)],
                    ],
                });

                expect(canDiscard([new NormalCard("♥", 8)])).toBe(true);
                expect(canDiscard([new NormalCard("♠", 8)])).toBe(true);
                expect(canDiscard([new NormalCard("♠", 7)])).toBe(false);
                expect(canDiscard([new NormalCard("♥", 6)])).toBe(false);
            });
        });

        describe("when top is (♥7, ♦7)", () => {

            it("should return true only if card count is same.", () => {

                const { canDiscard } = situation({
                    stack: [
                        [new NormalCard("♥", 7), new NormalCard("♦", 7)],
                        [new NormalCard("♠", 5), new NormalCard("♣", 5)],
                    ],
                });

                expect(canDiscard([new NormalCard("♥", 8)])).toBe(false);
                expect(canDiscard([new NormalCard("♠", 8), new NormalCard("♣", 8), new NormalCard("♦", 8)])).toBe(false);
                expect(canDiscard([new NormalCard("♠", 8), new NormalCard("♣", 8)])).toBe(true);
            });

            it("should return false if card rank is different.", () => {

                const { canDiscard } = situation({
                    stack: [
                        [new NormalCard("♥", 7), new NormalCard("♦", 7)],
                        [new NormalCard("♠", 5), new NormalCard("♣", 5)],
                    ],
                });

                expect(canDiscard([new NormalCard("♠", 8), new NormalCard("♠", 9)])).toBe(false);
            });
        });

        describe("when leader", () => {

            it("should return true.", () => {

                const { canDiscard } = situation({
                    stack: [],
                });

                expect(canDiscard([new NormalCard("♠", 3)])).toBe(true);
                expect(canDiscard([new NormalCard("♠", 3), new NormalCard("♣", 3)])).toBe(true);
                expect(canDiscard([new NormalCard("♠", 3), new NormalCard("♣", 3), new NormalCard("♥", 3)])).toBe(true);
                expect(canDiscard([new NormalCard("♠", 3), new NormalCard("♣", 3), new NormalCard("♥", 3), new NormalCard("♦", 3)])).toBe(true);
                expect(canDiscard([new NormalCard("♠", 2)])).toBe(true);
                expect(canDiscard([new Joker()])).toBe(true);
            });
        });

        describe("Joker", () => {

            it("should be almighty.", () => {

                const { canDiscard } = situation({
                    stack: [
                        [new NormalCard("♥", 7), new NormalCard("♦", 7)],
                        [new NormalCard("♠", 5), new NormalCard("♣", 5)],
                    ],
                });

                expect(canDiscard([new NormalCard("♠", 8), new Joker()])).toBe(true);
                expect(canDiscard([new NormalCard("♠", 7), new Joker()])).toBe(false);
            });

            it("should be higher than pair of 2.", () => {

                const { canDiscard } = situation({
                    stack: [
                        [new NormalCard("♥", 2), new NormalCard("♦", 2)],
                    ],
                });

                expect(canDiscard([new Joker(), new Joker(false)])).toBe(true);
                expect(canDiscard([new NormalCard("♠", 2), new Joker()])).toBe(false);
            });
        });

        function situation(s: { stack: Card[][] }) {

            const stack = new Stack();
            for (const cards of s.stack) {
                stack.cards.unshift(new CardSet(cards, "unknown"));
            }
            const rule = new Rule();
            const canDiscard = (cards: Card[]) => rule.canDiscard(stack, cards);

            return { canDiscard };
        }
    });
});
