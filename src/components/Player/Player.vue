<template>
  <div
    class="player"
    :class="{ cleared: player.isCleared, 'game-end': player.isGameEnd, 'trading': player.isTrading }"
  >
    <div class="player-buttons">
      <div
        class="pass-button player-button"
        :class="{'enabled':canPass}"
        v-on:click="canPass ? pass() : null"
      >パス</div>
      <div
        class="discard-button player-button"
        :class="{'enabled':canDiscard()}"
        v-on:click="canDiscard() ? discardStaging() : null"
        v-show="!player.waitingForNextGame"
      >カードを出す</div>
      <div
        class="next-game-button player-button enabled"
        v-on:click="goToNextGame()"
        v-show="player.waitingForNextGame"
      >次のゲームへ</div>
    </div>
    <div
      class="name"
      :class="{ 'turn': player.isMyTurn }"
      :data-player-rank="player.rank"
      :data-player-next-rank="player.nextRank"
    >{{ player.name }}</div>
    <div class="players-cards">
      <div v-for="card in rule.sort(player.cards, false)" :key="card.id" class="card-container">
        <card
          :card="card"
          :class="{ 'staging': card.isStaged, 'disable-stage': isCardGrayedOut(card) }"
          v-on:click.native="canStage(card) ? toggleCardStaging(card) : null"
        ></card>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./Player.scss";
</style>

<script lang="ts" src="./Player.ts"></script>
