<template>
    <div class="computer">
        <div class="name" :class="{ 'turn': computer.isMyTurn }">
            {{ computer.name }}
        </div>
        <div v-if="computer.isCleared">
            あがり
        </div>
        <div class="card-count">
            {{ computer.cards.length }}
        </div>
    </div>
</template>

<style scoped>
.turn {
  background: red;
  color: white;
}
</style>

<script>
export default {
  props: ["computer"]
};
</script>