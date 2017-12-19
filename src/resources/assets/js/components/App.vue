<template>
  <div class="main">
    <ul class="computers">
      <li v-for="computer in computers" :key="computer.name">
        <computer :computer="computer"></computer>
      </li>
    </ul>
    <div class="field">
      <div v-for="cards in field.cards" :key="cards.id" class="card-set">
        <div v-for="card in cards" :key="card.id" class="card-container">
          <card :card="card"></card>
        </div>
      </div>
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
  display: none;
}
.field .card-set:nth-last-child(1),
.field .card-set:nth-last-child(2) {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.field .card-set .card-container {
  width: calc(100% / 8 - 0.5vw);
  margin: 0.5vw 0.5vw 0 0;
  box-sizing: border-box;
}
.field .card-set:nth-last-child(2) {
  transform: translate(-1vw, -5vw);
}
.field .card-set:nth-last-child(2) .card {
  background: #c0c0c0;
}
.player {
  width: 100%;
}
</style>

<script>
import { field, Player, Computer, Card, ArrayEx } from "../models.js";

var characters = [
  new Computer("パクチー", "#F189C8", "vegetable_pakuchi_coriander.png"),
  new Player("台湾まぜそば", "#F1A15B"),
  new Computer("日本酒", "#34BD67", "masu_nihonsyu.png"),
  new Computer("餃子", "#26C4F0", "food_gyouza_mise.png"),
  new Computer("かまぼこ", "#C97842", "kamaboko_red.png")
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