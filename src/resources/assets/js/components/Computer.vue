<template>
    <div class="computer" :class="{ 'cleared': computer.isCleared, 'passing': computer.passing }">
        <div class="name" :class="{ 'turn': computer.isMyTurn }" :data-player-rank="computer.rank">
            {{ computer.name }}
        </div>
        <div class="image" :style="{ borderColor: computer.color, 'background-color': bgColor(computer.color) }">
            <img :src="imagePath(computer)" alt="">
        </div>
        <div class="cards" :data-card-count="computer.cards.length">
            <div v-for="card in computer.cards" :key="card.id" class="card"></div>
        </div>
    </div>
</template>

<style scoped>
.computer {
  position: relative;
}
.cleared:before {
  content: "あ";
  position: absolute;
  color: #ffffff;
  font-family: "M+ 1p black";
  font-weight: 900;
  background: hsla(51, 94%, 49%, 0.911);
  font-size: 6vw;
  padding: 1vw;
  z-index: 1;
  border-radius: 1vw;
  top: 41%;
  left: 2vw;
  display: inline-block;
  width: 6vw;
  height: 6vw;
  line-height: 6vw;
  vertical-align: middle;
  text-align: center;
  box-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
  text-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
}
.cleared .name:after {
  content: "が";
  position: absolute;
  color: #ffffff;
  font-family: "M+ 1p black";
  font-weight: 900;
  background: hsla(51, 94%, 49%, 0.911);
  font-size: 6vw;
  padding: 1vw;
  z-index: 1;
  border-radius: 1vw;
  top: 47%;
  left: 9vw;
  display: inline-block;
  width: 6vw;
  height: 6vw;
  line-height: 6vw;
  vertical-align: middle;
  text-align: center;
  box-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
  text-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
}
.cleared:after {
  content: "り";
  position: absolute;
  color: #ffffff;
  font-family: "M+ 1p black";
  font-weight: 900;
  background: hsla(51, 94%, 49%, 0.911);
  font-size: 6vw;
  padding: 1vw;
  z-index: 1;
  border-radius: 1vw;
  top: 53%;
  left: 16vw;
  display: inline-block;
  width: 6vw;
  height: 6vw;
  line-height: 6vw;
  vertical-align: middle;
  text-align: center;
  box-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
  text-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
}
.passing:before {
  content: "パ";
  position: absolute;
  color: #ffffff;
  font-family: "M+ 1p black";
  font-weight: 900;
  background: hsla(197, 94%, 49%, 0.911);
  font-size: 6vw;
  padding: 1vw;
  z-index: 1;
  border-radius: 1vw;
  top: 28%;
  left: 5vw;
  display: inline-block;
  width: 6vw;
  height: 6vw;
  line-height: 6vw;
  vertical-align: middle;
  text-align: center;
  box-shadow: hsla(209, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
  text-shadow: hsla(209, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
}
.passing:after {
  content: "ス";
  position: absolute;
  color: #ffffff;
  font-family: "M+ 1p black";
  font-weight: 900;
  background: hsla(197, 94%, 49%, 0.911);
  font-size: 6vw;
  padding: 1vw;
  z-index: 1;
  border-radius: 1vw;
  top: 40%;
  left: 12vw;
  display: inline-block;
  width: 6vw;
  height: 6vw;
  line-height: 6vw;
  vertical-align: middle;
  text-align: center;
  box-shadow: hsla(209, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
  text-shadow: hsla(209, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
}
.turn {
  background: #cc1160;
  color: white;
}
.name {
  text-align: center;
  font-weight: bold;
  font-size: 5vw;
  margin: 10vw 0 0;
}

.name[data-player-rank]:before {
  position: absolute;
  font-weight: 900;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 4vw;
  margin: 0;
  top: -7vw;
  font-family: "M+ 1p black";
}

.name[data-player-rank="1"]:before {
  content: "\1F4A9大貧民";
  color: #530165;
}
.name[data-player-rank="2"]:before {
  content: "\1F4B8貧民";
  color: #08507A;
}
.name[data-player-rank="3"]:before {
  content: "\1F4B0平民";
  color: #1E4A05;
}
.name[data-player-rank="4"]:before {
  content: "\1F4B4富豪";
  color: #62360C;
}
.name[data-player-rank="5"]:before {
  content: "\1F451大富豪";
  color: #5e550c;
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

.cards[data-card-count="0"]:after {
  content: "";
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
      const match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(
        baseColor
      );
      const colors = [
        parseInt(match[1], 16),
        parseInt(match[2], 16),
        parseInt(match[3], 16)
      ];
      return `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.2)`;
    }
  }
};
</script>