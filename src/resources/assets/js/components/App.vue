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

var players = [
  new Player("シャーロック"),
  new Player("ネロ"),
  new Player("エリー"),
  new Player("コーデリア"),
  new Player("かまぼこ")
];

export default {
  data() {
    return {
      players,
      cards: [{ id: "h-3", isJoker: false, suit: "♥", rank: 3 }]
    };
  }
};
</script>