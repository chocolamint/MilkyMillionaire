<template>
  <div class="main">
    <ul class="computers">
      <li v-for="computer in computers" :key="computer.name">
        <computer :computer="computer"></computer>
      </li>
    </ul>
    <div class="field">
      <transition-group name="card-discard" tag="div">
        <div v-for="cards in field.cards" :key="cards.id" class="card-set" :data-discarded-by="cards.discardedBy">
            <div v-for="card in cards" :key="card.id" class="card-container">
                <card :card="card"></card>
            </div>
        </div>
      </transition-group>
    </div>
    <player :player="player" :field="field" class="player"></player>
  </div>
</template>

<style scoped>
.computers {
  display: flex;
  flex-wrap: nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}
.computers:before {
  content: "";
  padding-top: 20%;
  display: block;
}
.computers li {
  width: 25%;
}
.field {
  width: 100%;
  position: relative;
}
.field:before {
  content: "";
  padding-top: 40%;
  display: block;
}
@media screen and (min-device-height: 800px) {
  .field:before {
    padding-top: 60%;
  }
}
.field .card-set {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -14vw;
  left: -3vw;
  right: 0;
  bottom: 0;
}
.field .card-set .card-container {
  width: calc(100% / 8 - 0.5vw);
  margin: 0.5vw 0.5vw 0 0;
  box-sizing: border-box;
}
.field .card-set:nth-last-child(1),
.field .card-set:nth-last-child(2) {
  left: 0;
  top: 0;
}
.field .card-set:nth-last-child(2) {
  top: -14vw;
  left: -3vw;
  animation: discarded-cards-2 1.3s lenear;
}

@keyframes discarded-cards-2 {
  0% {
    top: 0;
    left: 0;
  }
  100% {
    top: -14vw;
    left: -3vw;
  }
}

.field .card-set:nth-last-child(2) .card {
  background: #c0c0c0;
}
.card-discard-enter[data-discarded-by="0"] {
  transform: translate(-30vw, -20vw);
}
.card-discard-enter[data-discarded-by="1"] {
  transform: translate(-13vw, -20vw);
}
.card-discard-enter[data-discarded-by="2"] {
  transform: translate(13vw, -20vw);
}
.card-discard-enter[data-discarded-by="3"] {
  transform: translate(30vw, -20vw);
}
.card-discard-enter[data-discarded-by="-1"] {
  transform: translate(0, 20vw);
}
.card-discard-enter-active {
  transition: transform 0.3s linear;
  transform: translate(0, 0);
}
.card-discard-leave-active {
  transition: transform 0.3s linear;
  transform: translate(0, 0);
}
.card-discard-leave-to {
  transform: translate(-60vw, 0);
}
.player {
  width: 100%;
}
</style>

<script>
import { field, Player, Computer, Card, ArrayEx } from "../models.js";

var characters = [
  new Computer("パクチー", "#F189C8", "vegetable_pakuchi_coriander.png"),
  new Computer("日本酒", "#34BD67", "masu_nihonsyu.png"),
  new Computer("餃子", "#26C4F0", "food_gyouza_mise.png"),
  new Computer("かまぼこ", "#C97842", "kamaboko_red.png"),
  new Player("台湾まぜそば", "#F1A15B")
];

const computers = characters.filter(x => x instanceof Computer);
const player = characters.filter(x => x instanceof Player)[0];

const cards = Card.allCards();

field.beginGame(characters, cards);

export default {
  data() {
    return {
      computers,
      player,
      cards,
      field
    };
  }
};
</script>