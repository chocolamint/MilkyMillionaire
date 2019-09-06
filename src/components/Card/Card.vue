<template>
  <div class="card" :class="[suitClass, rankClass, { 'joker': card.isJoker }]">
    <div v-if="card.isJoker">
      <span>Joker</span>
    </div>
    <div v-else>
      <span class="suit">{{ card.suit }}</span>
      <span class="rank" :data-rank="card.rank">{{ showCardRank }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./Card.scss";
</style>

<script lang="ts" src="./Card.ts"></script>
