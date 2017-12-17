<template>
    <div class="card">
        <div v-if="card.isJoker">
            <span>Joker</span>
        </div>
        <div v-else>
            <span class="suit">
                {{ card.suit }}
            </span>
            <span class="rank">
                {{ card.rank }}
            </span>
        </div>
    </div>
</template>

<style scoped>
    .card {
        border: solid 1px #909090;
        border-radius: 3px;
    }
</style>

<script>
export default {
  props: ["card"]
};
</script>