<template>
    <div class="card">
        <div v-if="card.isJoker">
            <div>Joker</div>
        </div>
        <div v-else>
            <div class="suit">
                {{ card.suit }}
            </div>
            <div class="rank">
                {{ card.rank }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: ["card"]
};
</script>