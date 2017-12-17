<template>
    <div class="player">
        <div class="name">
            {{ name }}
        </div>
        <div class="players-cards">
            <div v-for="card in cards" :key="card.id" class="card-container">
                <card v-bind="card" v-bind:class="{ 'staging': card.isStaged }" v-on:click.native="toggleCardStaging(card)"></card>
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
  props: ["name", "cards"],
  methods: {
    toggleCardStaging: function(card) {
      card.isStaged = !card.isStaged;
      console.log(card.isStaged);
    }
  }
};
</script>