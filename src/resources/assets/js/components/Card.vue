<template>
    <div class="card" :class="[suitClass(card), rankClass(card), { 'joker': card.isJoker }]">
        <div v-if="card.isJoker">
            <span>Joker</span>
        </div>
        <div v-else>
            <span class="suit">{{ card.suit }}</span><span class="rank" :data-rank="card.rank">{{ showCardRank(card.rank) }}</span>
        </div>
    </div>
</template>

<style scoped>
.card {
  border: solid 0.3vw #c0c0c0;
  border-radius: 1vw;
  background: #ffffff;
  position: relative;
  height: auto;
  box-sizing: border-box;
}
.card:before {
  content: "";
  display: block;
  padding-top: 141.3%;
}
.card > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 5vw;
  line-height: 1.2em;
  text-align: center;
  box-sizing: border-box;
  padding-top: 1vw;
}
.card.joker > div {
  font-size: 3.5vw;
  line-height: 2em;
}
.card.heart,
.card.diamond {
  color: red;
}
.card .suit {
  font-family: "HiraKakuProN-W6" !important;
  font-size: 90%;
}
.card .rank[data-rank="10"] {
  letter-spacing: -0.4vw;
}
</style>

<script lang="ts">
import { Card } from "../models";

export default {
  props: ["card"],
  methods: {
    suitClass: function(card: Card) {
      const suitClasses: Record<string, string> = {
        "♥": "heart",
        "♦": "diamond",
        "♠": "spade",
        "♣": "club"
      };
      return suitClasses[card.suit];
    },
    rankClass: function(card: Card) {
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
      return rankClasses[card.rank];
    },
    showCardRank: function(rank: number) {
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
};
</script>