<template>
  <div class="message">
    {{ message }}
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
.message {
  color: red;
}
</style>

<script>
export default {
  data() {
    return {
      message: "hello world",
      players: [
        {
          cards: [{ id: "h-3", isJoker: false, suit: "♥", rank: 3 }],
          name: "シャーロック"
        }
      ],
      cards: [{ id: "h-3", isJoker: false, suit: "♥", rank: 3 }]
    };
  }
};
</script>