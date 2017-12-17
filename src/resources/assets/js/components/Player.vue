<template>
    <div class="player">
        <div class="name">
            {{ character.name }}
        </div>
        <div class="players-cards">
            <div v-for="card in character.cards" :key="card.id" class="card-container">
                <card :card="card" v-bind:class="{ 'staging': card.isStaged }" v-on:click.native="toggleCardStaging(card)"></card>
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
</style>

<script>
export default {
  props: ["character"],
  methods: {
    toggleCardStaging: function(card) {
      card.isStaged = !card.isStaged;
      console.log(card.isStaged);
    }
  }
};
</script>