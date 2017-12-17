<template>
    <div class="computer">
        <div class="name">
            {{ name }}
        </div>
        <div class="card-count">
            {{ cards.length }}
        </div>
    </div>
</template>


<script>
export default {
  props: ["name", "cards"]
};
</script>