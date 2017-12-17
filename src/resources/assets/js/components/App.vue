<template>
  <div class="main">
    <ul class="computers">
      <li v-for="computer in computers" :key="computer.name">
        <computer :character="computer"></computer>
      </li>
    </ul>
    <player :character="player"></player>
  </div>
</template>

<style scoped>
.computers {
  display: flex;
  flex-wrap: nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
}
.computers li {
  width: 25%;
  background: #fff0f0;
}
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

/**
 * @param {Number} n
 */
const range = n => [...Array(n).keys()].map(x => Number(x));

/**
 * @param {T[]} arr 
 * @returns {T[]}
*/
const shuffle = arr => {
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

const suits = ["♥", "♦", "♠", "♣"];
const cards = range(13)
  .map(r => suits.map(s => new Card(s, r + 1)))
  .reduce((a, b) => a.concat(b))
  .concat(new Card(null, null, true), new Card(null, null, true));

/**
 * @param {Character[]} characters  
 * @param {Card[]} cards
*/
const deal = (characters, cards) => {
  let i = 0;
  for (const card of shuffle(cards)) {
    characters[i++ % 5].cards.push(card);
  }
};

deal(characters, cards);

const computers = characters.filter(x => x instanceof Computer);
const player = characters.filter(x => x instanceof Player)[0];

/**
 * @param {Card} a
 * @param {Card} b
 */
const compareCard = (a, b) => {
  if (a.isJoker && b.isJoker) return 0;
  if (a.isJoker) return 1;
  if (b.isJoker) return -1;
  const numberRanks = n => (n == 2 ? 15 : n == 1 ? 14 : n);
  if (a.rank != b.rank) {
    return numberRanks(a.rank) - numberRanks(b.rank);
  }
  const suitRanks = {
    "♥": 0,
    "♦": 1,
    "♠": 2,
    "♣": 3
  };
  return suitRanks[a.suit] - suitRanks[b.suit];
};

player.cards.sort(compareCard);

export default {
  data() {
    return {
      computers,
      player,
      cards
    };
  }
};
</script>