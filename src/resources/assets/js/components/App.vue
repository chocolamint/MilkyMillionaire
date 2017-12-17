<template>
  <div class="main">
    <ul>
      <li v-for="player in players" :key="player.name">
        <player :player="player"></player>
        <div v-for="card in player.cards" :key="card.id">
          <card :card="card"></card>
        </div>
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
var shuffle = function (arr) {
  var i, j, temp;
  arr = arr.slice();
  i = arr.length;
  if (i === 0) {
    return arr;
  }
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

var suits = ["♥", "♦", "♠", "♣"];
var cards = range(13)
  .map(r => suits.map(s => new Card(s, r + 1)))
  .reduce((a, b) => a.concat(b))
  .concat(new Card(null, null, true), new Card(null, null, true));

var i = 0;
for (var card of shuffle(cards)) {
  players[i++ % 5].cards.push(card);
}

export default {
  data() {
    return {
      players,
      cards
    };
  }
};
</script>