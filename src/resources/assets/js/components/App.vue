<template>
  <div class="main">
    <ul class="computers">
      <li v-for="computer in computers" :key="computer.name">
        <computer :computer="computer"></computer>
      </li>
    </ul>
    <div class="field">
      <div v-for="cards in field.cards" :key="cards.id" class="card-set" :class="[cardCountClass(field.cards)]">
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
  background: #fff0f0;
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
  background: #f0f0ff;
  position: relative;
}
.field:before {
  content: "";
  padding-top: 60%;
  display: block;
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
  background: #f0fff0;
}
.player:before {
  content: "";
  display: block;
  padding-top: 10%;
}
</style>

<script>
import { field, Player, Computer, Card, ArrayEx } from "../models.js";

var characters = [
  new Player("シャーロック"),
  new Computer("ネロ"),
  new Computer("エリー"),
  new Computer("コーデリア"),
  new Computer("かまぼこ")
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
  },
  methods: {
    cardCountClass: function(cards) {
      switch (cards.length) {
        case 1:
          return "single";
        case 2:
          return "double";
      }
    }
  }
};
</script>