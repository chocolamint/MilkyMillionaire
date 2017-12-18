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
import { field, Player, Computer, Card } from "../models.js";

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
  .map(x => x + 1)
  .map(rank => suits.map(suit => new Card("s-" + rank, suit, rank)))
  .reduce((a, b) => a.concat(b))
  .concat(
    new Card("joker1", null, null, true),
    new Card("joker2", null, null, true)
  );

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

player.cards.sort(Card.compareSort);

/** @param {Character[]} characters */
const beginGame = async function(characters) {
  let nextDealer = characters[Math.floor(Math.random() * 5)];
  console.log(`${nextDealer.name}の親ではじめます`);
  while (true) {
    for (const character of characters) {
      if (nextDealer != null && nextDealer != character) continue;
      nextDealer = null;
      nextDealer = await character.turn();
      if (nextDealer != null) {
        console.log(`${nextDealer.name}の親ではじめます`);
        break;
      }
    }
  }
};

beginGame(characters);

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