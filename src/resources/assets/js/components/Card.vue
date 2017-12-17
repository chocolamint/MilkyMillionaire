<template>
    <div class="card">
        <div v-if="isJoker">
            <span>Joker</span>
        </div>
        <div v-else>
            <span class="suit">
                {{ suit }}
            </span>
            <span class="rank">
                {{
                    rank == 1 ? 'A' : 
                    rank == 11 ? 'J' : 
                    rank == 12 ? 'Q' :
                    rank == 13 ? 'K' :
                    rank
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
  background: #ffffff;
}
</style>

<script>
export default {
  props: ["isJoker", "suit", "rank"]
};
</script>