<template>
    <div class="player">
        <div class="name" :class="{ 'turn': player.isMyTurn }">
            {{ player.name }}
        </div>
        <div>
          <div v-on:click="pass(player)">パス</div>
          <div v-on:click="discardStaging(player)">カードを捨てる</div>
        </div>
        <div class="players-cards">
            <div v-for="card in player.cards" :key="card.id" class="card-container">
                <card :card="card" 
                  :class="{ 'staging': card.isStaged, 'disable-stage': !canStage(card, player, field) }"
                  v-on:click.native="canStage(card, player, field) ? toggleCardStaging(card) : null"></card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.turn {
  background: red;
  color: white;
}

.players-cards {
  display: flex;
  flex-wrap: wrap;
  margin: 1vw 0.5vw;
}

.card-container {
  width: calc(100% / 8 - 0.5vw);
  margin: 0.5vw 0.5vw 0 0;
  box-sizing: border-box;
}

.staging {
  position: relative;
  top: -2vw;
}

.card.disable-stage {
  background: #c0c0c0;
}
</style>

<script>
import { Card } from "../models.js";

export default {
  props: ["player", "field"],
  methods: {
    toggleCardStaging: function(card) {
      card.isStaged = !card.isStaged;
      console.log(card.isStaged);
    },
    pass: function(player) {
      player.pass();
    },
    discardStaging: function(player) {
      player.discardStaging();
    },
    canStage(card, player, field) {
      const stagings = player.stagings();
      if (stagings.length == 0) {
        const top = field.top();
        if (top == null) return true;
        return Card.compareRank(card, top[0]) > 0;
      } else {
        return stagings[0].rank == card.rank;
      }
    }
  }
};
</script>