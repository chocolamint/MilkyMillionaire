import { NormalCard, Joker, Card } from "@/models/Card";
import Rule from "@/models/Rule";
import { expect } from "chai";
import Stack from "@/models/Stack";
import CardSet from "@/models/CardSet";

describe("Rule.ts", () => {

    describe("sort method", () => {

        it("order cards by weakness.", () => {
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

            expect(sorted).to.eql([
                new NormalCard("♠", 3),
                new NormalCard("♦", 10),
                new NormalCard("♣", 13),
                new NormalCard("♥", 1),
                new NormalCard("♠", 2),
                new Joker(true),
            ]);
        });

        it("order cards by strongness.", () => {
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

            expect(sorted).to.eql([
                new Joker(true),
                new NormalCard("♠", 2),
                new NormalCard("♥", 1),
                new NormalCard("♣", 13),
                new NormalCard("♦", 10),
                new NormalCard("♠", 3),
            ]);
        });

        it("order cards by suit if rank is same.", () => {

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

            expect(sortedAsc).to.eql([
                new NormalCard("♠", 6),
                new NormalCard("♥", 7),
                new NormalCard("♦", 7),
                new NormalCard("♠", 7),
                new NormalCard("♣", 7),
                new NormalCard("♥", 8),
            ]);
            expect(sortedDesc).to.eql([
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

        const bind = (rule: Rule, stack: Stack) => (cards: Card[]) => rule.canDiscard(stack, cards);

        it("returns true only if stronger than stack top.", () => {

            const stack = new Stack();
            stack.cards.push(new CardSet([new NormalCard("♠", 5)], "unknown"));
            stack.cards.push(new CardSet([new NormalCard("♥", 7)], "unknown"));
            const rule = new Rule();
            const canDiscard = bind(rule, stack);

            expect(canDiscard([new NormalCard("♥", 8)])).to.equal(true);
            expect(canDiscard([new NormalCard("♠", 8)])).to.equal(true);
            expect(canDiscard([new NormalCard("♠", 7)])).to.equal(false);
            expect(canDiscard([new NormalCard("♥", 6)])).to.equal(false);
        });

        it("returns true only if card count is same.", () => {

            const stack = new Stack();
            stack.cards.push(new CardSet([new NormalCard("♠", 5), new NormalCard("♣", 5)], "unknown"));
            stack.cards.push(new CardSet([new NormalCard("♥", 7), new NormalCard("♦", 7)], "unknown"));
            const rule = new Rule();
            const canDiscard = bind(rule, stack);

            expect(canDiscard([new NormalCard("♥", 8)])).to.equal(false);
            expect(canDiscard([new NormalCard("♠", 8), new NormalCard("♣", 8), new NormalCard("♦", 8)])).to.equal(false);
            expect(canDiscard([new NormalCard("♠", 8), new NormalCard("♣", 8)])).to.equal(true);
        });

        describe("Joker", () => {

            it("is almighty.", () => {

                const stack = new Stack();
                stack.cards.push(new CardSet([new NormalCard("♠", 5), new NormalCard("♣", 5)], "unknown"));
                stack.cards.push(new CardSet([new NormalCard("♥", 7), new NormalCard("♦", 7)], "unknown"));
                const rule = new Rule();
                const canDiscard = bind(rule, stack);

                expect(canDiscard([new NormalCard("♠", 8), new Joker(true)])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 7), new Joker(true)])).to.equal(false);
            });

            it("is stronger than 2 pair.", () => {

                const stack = new Stack();
                stack.cards.push(new CardSet([new NormalCard("♥", 2), new NormalCard("♦", 2)], "unknown"));
                const rule = new Rule();
                const canDiscard = bind(rule, stack);

                expect(canDiscard([new Joker(true), new Joker(false)])).to.equal(true);
                expect(canDiscard([new NormalCard("♠", 2), new Joker(true)])).to.equal(false);
            });
        });
    });
});
