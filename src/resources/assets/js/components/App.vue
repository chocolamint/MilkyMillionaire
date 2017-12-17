<template>
  <div class="main">
    <ul>
      <li v-for="card in cards" :key="card.id">
        <card :card="card"></card>
      </li>
    </ul>
    <ul>
      <li v-for="player in players" :key="player.name">
        <player :player="player"></player>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>

<script>
class Player {
  constructor(name) {
    this.name = name;
    this.cards = [];
  }
}

class Card {
  constructor(suit, rank, isJoker) {
    this.suit = suit;
    this.rank = rank;
    this.isJoker = isJoker;
  }
}

var players = [
  new Player("シャーロック"),
  new Player("ネロ"),
  new Player("エリー"),
  new Player("コーデリア"),
  new Player("かまぼこ")
];

var range = n => [...Array(n).keys()].map(x => Number(x));
var suits = ["♥", "♦", "♠", "♣"];
var cards = range(13)
  .map(r => suits.map(s => new Card(s, r + 1)))
  .reduce((a, b) => a.concat(b))
  .concat(new Card(null, null, true), new Card(null, null, true));

export default {
  data() {
    return {
      players,
      cards
    };
  }
};
</script>