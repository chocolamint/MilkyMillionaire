<template>
    <div class="computer">
        <div class="name">
            {{ character.name }}
        </div>
        <div class="card-count">
            {{ character.cards.length }}
        </div>
    </div>
</template>


<script>
export default {
  props: ["character"]
};
</script>