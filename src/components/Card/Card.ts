import { Component, Vue, Prop } from "vue-property-decorator";
import { Card } from "@/models/Card";

@Component({ name: "Card" })
export default class CardComponent extends Vue {

    @Prop()
    public card!: Card;

    get suitClass() {
        if (this.card.isJoker) return "";
        const suitClasses: Record<string, string> = {
            "♥": "heart",
            "♦": "diamond",
            "♠": "spade",
            "♣": "club"
        };
        return suitClasses[this.card.suit];
    }

    get rankClass() {
        if (this.card.isJoker) return "";
        const rankClasses = [
            "ace",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            "nine",
            "ten",
            "juck",
            "queen",
            "king"
        ];
        return rankClasses[this.card.rank];
    }

    get showCardRank() {
        if (this.card.isJoker) return "";
        const rank = this.card.rank;
        switch (rank) {
            case 1:
                return "A";
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            default:
                return String(rank);
        }
    }
}