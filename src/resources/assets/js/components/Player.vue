<template>
    <div class="player">
        <div class="name">
            {{ player.name }}
        </div>
        <div>
          <div v-on:click="discardStaging(player)">カードを捨てる</div>
        </div>
        <div class="players-cards">
            <div v-for="card in player.cards" :key="card.id" class="card-container">
                <card v-bind="card" 
                  :class="{ 'staging': card.isStaged, 'disable-stage': !canStage(card, player, field) }"
                  v-on:click.native="canStage(card, player, field) ? toggleCardStaging(card) : null"></card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.players-cards {
  display: flex;
  flex-wrap: wrap;
}

.players-cards > * {
  width: calc(100% / 8);
}

.staging {
  /*transform: translateY(-10px);*/
  position: relative;
  top: -10px;
}

.card.disable-stage {
  background: #C0C0C0;
}
</style>

<script>
import { Card } from '../models.js';

export default {
  props: ["player", "field"],
  methods: {
    toggleCardStaging: function(card) {
      card.isStaged = !card.isStaged;
      console.log(card.isStaged);
    },
    discardStaging: function(player) {
      player.discardStaging();
    },
    canStage(card, player, field) {
      const top = field.top();
      if (top == null) return true;
      return Card.compareRank(card, top[0]) > 0;
    }
  }
};
</script>