<template>
  <div class="message">
    {{ message }}
  </div>
</template>

<style scoped>
  .message {
    color: red;
  }
</style>

<script>
export default {
  data () {
    return {
      message: 'hello world'
    };
  }
};
</script>