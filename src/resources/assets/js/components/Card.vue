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
                {{
                    card.rank == 1 ? 'A' : 
                    card.rank == 11 ? 'J' : 
                    card.rank == 12 ? 'Q' :
                    card.rank == 13 ? 'K' :
                    card.rank
                }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.card {
  border: solid 1px #909090;
  border-radius: 3px;
  height: 40px;
  background: #FFFFFF;
}
</style>

<script>
export default {
  props: ["card"]
};
</script>