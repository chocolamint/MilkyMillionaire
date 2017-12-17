<template>
    <div class="player">
        <div class="name">
            {{ character.name }}
        </div>
        <div class="players-cards">
            <div v-for="card in character.cards" :key="card.id" class="card-container">
                <card :card="card"></card>
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
</style>

<script>
export default {
  props: ["character"]
};
</script>