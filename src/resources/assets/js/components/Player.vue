<template>
    <div class="player">
        <div class="name">
            {{ player.name }}
        </div>
        <div class="card-count">
            {{ player.cards.length }}
        </div>
    </div>
</template>


<script>
export default {
  props: ["player"]
};
</script>