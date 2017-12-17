<template>
  <div class="main">
    <ul>
      <li v-for="computer in computers" :key="computer.name">
        <computer :character="computer"></computer>
      </li>
    </ul>
    <player :character="player"></player>
  </div>
</template>

<style scoped>

</style>

<script>
class Character {
  constructor(name) {
    this.name = name;
    this.cards = [];
  }
}

class Player extends Character {}

class Computer extends Character {}

class Card {
  constructor(suit, rank, isJoker) {
    this.suit = suit;
    this.rank = rank;
    this.isJoker = isJoker;
  }
}

var characters = [
  new Player("シャーロック"),
  new Computer("ネロ"),
  new Computer("エリー"),
  new Computer("コーデリア"),
  new Computer("かまぼこ")
];

var range = n => [...Array(n).keys()].map(x => Number(x));
var shuffle = function(arr) {
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

var deal = (characters, cards) => {
  var i = 0;
  for (var card of shuffle(cards)) {
    characters[i++ % 5].cards.push(card);
  }
};

deal(characters, cards);

export default {
  data() {
    return {
      computers: characters.filter(x => x instanceof Computer),
      player: characters.filter(x => x instanceof Player)[0],
      cards
    };
  }
};
</script>