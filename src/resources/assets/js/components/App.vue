<template>
  <div class="main">
    <ul class="computers">
      <li v-for="computer in computers" :key="computer.name">
        <computer :computer="computer"></computer>
      </li>
    </ul>
    <div class="field">
      <div v-for="cards in field.cards" :key="cards.id">
        <div v-for="card in cards" :key="card.id">
          <card v-bind="card"></card>
        </div>
      </div>
    </div>
    <player :player="player" :field="field"></player>
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

const beginGame = async function() {
  while (true) {
    for (const character of characters) {
      await character.turn();
    }
  }
};

beginGame();

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