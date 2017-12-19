<template>
    <div class="computer">
        <div class="name" :class="{ 'turn': computer.isMyTurn }">
            {{ computer.name }}
        </div>
        <div class="image" :style="{ borderColor: computer.color, 'background-color': bgColor(computer.color) }">
            <img :src="imagePath(computer)" alt="">
        </div>
        <div v-if="computer.isCleared">
            あがり
        </div>
        <div class="cards" :data-card-count="computer.cards.length">
            <div v-for="card in computer.cards" :key="card.id" class="card"></div>
        </div>
    </div>
</template>

<style scoped>
.turn {
  background: #CC1160;
  color: white;
}
.name {
  text-align: center;
  font-weight: bold;
  font-size: 5vw;
  margin: 4vw 0 0;
}
.image {
  text-align: center;
  position: relative;
  width: 70%;
  margin: 2vw auto;
  border-style: solid;
  border-width: 0.5vw;
  border-radius: 1.5vw;
}
.image:before {
  content: "";
  padding-top: 100%;
  display: block;
}
.image img {
  width: 62.5%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

.cards {
  text-align: center;
  direction: rtl;
  padding-right: 2.25vw;
  position: relative;
  vertical-align: middle;
}

.cards:after {
  content: attr(data-card-count);
  position: absolute;
  z-index: 1;
  text-align: center;
  color: #ffffff;
  font-size: 3.2vw;
  font-weight: bold;
  text-shadow: #000000 -0.1vw 0 0;
  display: inline-block;
  width: 4.5vw;
  height: 6.36vw;
  margin-right: -4.5vw;
  line-height: 6.36vw;
  vertical-align: middle;
}

.card {
  width: 4.5vw;
  height: 6.36vw;
  margin-right: -3.5vw;
  border: solid 1px #ffffff;
  background: linear-gradient(#fbcc25, #fd7f02);
  border-radius: 0.6vw;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
}
</style>

<script>
export default {
  props: ["computer"],
  methods: {
    imagePath(computer) {
      return `images/${computer.image}`;
    },
    bgColor(baseColor) {
      const match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(baseColor);
      const colors = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
      return `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.2)`;
    }
  }
};
</script>