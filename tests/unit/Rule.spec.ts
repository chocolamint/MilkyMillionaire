import { NormalCard, Joker, Card } from "@/models/Card";
import Rule from "@/models/Rule";
import { expect } from "chai";
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

            expect(sorted).to.deep.equal([
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

            expect(sorted).to.deep.equal([
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

            expect(sortedAsc).to.deep.equal([
                new NormalCard("♠", 6),
                new NormalCard("♥", 7),
                new NormalCard("♦", 7),
                new NormalCard("♠", 7),
                new NormalCard("♣", 7),
                new NormalCard("♥", 8),
            ]);
            expect(sortedDesc).to.deep.equal([
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

                expect(canDiscard([new NormalCard("♥", 8)])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 8)])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 7)])).to.equal(false);
                expect(canDiscard([new NormalCard("♥", 6)])).to.equal(false);
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

                expect(canDiscard([new NormalCard("♥", 8)])).to.equal(false);
                expect(canDiscard([new NormalCard("♠", 8), new NormalCard("♣", 8), new NormalCard("♦", 8)])).to.equal(false);
                expect(canDiscard([new NormalCard("♠", 8), new NormalCard("♣", 8)])).to.equal(true);
            });

            it("should return false if card rank is different.", () => {

                const { canDiscard } = situation({
                    stack: [
                        [new NormalCard("♥", 7), new NormalCard("♦", 7)],
                        [new NormalCard("♠", 5), new NormalCard("♣", 5)],
                    ],
                });

                expect(canDiscard([new NormalCard("♠", 8), new NormalCard("♠", 9)])).to.equal(false);
            });
        });

        describe("when leader", () => {

            it("should return true.", () => {

                const { canDiscard } = situation({
                    stack: [],
                });

                expect(canDiscard([new NormalCard("♠", 3)])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 3), new NormalCard("♣", 3)])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 3), new NormalCard("♣", 3), new NormalCard("♥", 3)])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 3), new NormalCard("♣", 3), new NormalCard("♥", 3), new NormalCard("♦", 3)])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 2)])).to.equal(true);
                expect(canDiscard([new Joker()])).to.equal(true);
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

                expect(canDiscard([new NormalCard("♠", 8), new Joker()])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 7), new Joker()])).to.equal(false);
            });

            it("should be higher than pair of 2.", () => {

                const { canDiscard } = situation({
                    stack: [
                        [new NormalCard("♥", 2), new NormalCard("♦", 2)],
                    ],
                });

                expect(canDiscard([new Joker(), new Joker(false)])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 2), new Joker()])).to.equal(false);
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
