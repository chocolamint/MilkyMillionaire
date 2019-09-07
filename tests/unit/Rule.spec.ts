import { NormalCard, Joker } from "@/models/Card";
import Rule from "@/models/Rule";
import { expect } from "chai";

describe("Rule.ts", () => {

    it("should be ordered by weakness", () => {
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

    it("should be ordered by strongness", () => {
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

    it("should be ordered by suit if rank is same.", () => {

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
