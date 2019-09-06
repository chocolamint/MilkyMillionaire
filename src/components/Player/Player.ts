import { Component, Vue, Prop } from "vue-property-decorator";
import { combination, sleep } from "@/models/Utils";
import { Card } from "@/models/Card";
import Player from "@/models/Player";
import CardComponent from "@/components/Card/Card.vue";
import Rule from "@/models/Rule";

@Component({ name: "Player", components: { card: CardComponent } })
export default class PlayerComponent extends Vue {
    @Prop()
    public player!: Player;

    @Prop()
    public rule!: Rule;

    toggleCardStaging(card: Card) {
        card.isStaged = !card.isStaged;
    }

    stagings() {
        return this.player.cards.filter(x => x.isStaged);
    }

    pass() {
        this.stagings().forEach(x => x.isStaged = false);
        this.player.pass();
    }

    isUnnecessaryCardSelecting() {
        return this.player.isTrading && this.player.rank >= 4;
    }

    async discardStaging() {
        if (this.isUnnecessaryCardSelecting()) {
            const stagings = this.stagings();
            for (const card of stagings) {
                card.isStaged = false;
                this.player.trashCard(card);
            }
            this.player.isTrading = false;
            await sleep(500);
            this.player.give(stagings);
        } else {
            var stagings = this.stagings();
            for (const card of stagings) {
                card.isStaged = false;
            }
            this.player.discard(stagings);
        }
    }

    canDiscard() {
        if (this.isUnnecessaryCardSelecting()) {
            const missingCount = this.player.rank - 3;
            return this.stagings().length == missingCount;
        } else {
            if (this.player.currentTurn == null) return false;
            return this.player.currentTurn.canDiscard(this.stagings());
        }
    }
    isCardGrayedOut(card: Card) {
        if (this.isUnnecessaryCardSelecting()) {
            return !this.canStage(card);
        }
        return this.player.isMyTurn && !this.canStage(card);
    }

    canStage(card: Card) {
        const stagings = this.stagings();

        if (this.isUnnecessaryCardSelecting()) {
            const missingCount = this.player.rank - 3;
            return stagings.length < missingCount || stagings.indexOf(card) != -1;
        }

        if (!this.player.isMyTurn) return false;

        const top = this.player.currentTurn!.stack.top();
        if (stagings.length == 0) {
            if (top == null) return true;
            const discardables = combination(this.player.cards, top.length)
                .filter(xs => this.player.currentTurn!.canDiscard(xs));
            return discardables.some(xs => xs.indexOf(card) != -1);
        } else {
            return (
                this.player.currentTurn!.canDiscard(stagings.concat(card)) ||
                stagings.indexOf(card) != -1
            );
        }
    }

    get canPass() {
        return this.player.isMyTurn;
    }

    goToNextGame() {
        this.player.goToNextGame();
    }
}