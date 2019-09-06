<template>
  <div
    class="computer"
    :class="{ 'cleared': computer.isCleared, 'passing': computer.passing, 'game-end': computer.isGameEnd }"
  >
    <div
      class="name"
      :class="{ 'turn': computer.isMyTurn }"
      :data-player-rank="computer.rank"
      :data-player-next-rank="computer.nextRank"
    >{{ computer.name }}</div>
    <div class="image" :style="{ borderColor: color, 'background-color': bgColor }">
      <img :src="require(`@/assets/images/${imageFileName}`)" alt />
    </div>
    <div class="cards" :data-card-count="computer.restCount">
      <div v-for="card in computer.cards" :key="card.id" class="card"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./Computer.scss";
</style>

<script lang="ts" src="./Computer.ts"></script>
