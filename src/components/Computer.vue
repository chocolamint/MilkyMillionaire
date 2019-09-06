<template>
  <div
    class="computer"
    :class="{ 'cleared': computer.isCleared, 'passing': computer.passing, 'game-end': computer.isGameEnd }"
  >
    <div
      class="name"
      :class="{ 'turn': computer.isMyTurn }"
      :data-player-rank="computer.rank"
      :data-player-next-rank="computer.nextRank"
    >{{ computer.name }}</div>
    <div class="image" :style="{ borderColor: color, 'background-color': bgColor }">
      <img :src="require(`@/assets/images/${imageFileName}`)" alt />
    </div>
    <div class="cards" :data-card-count="computer.restCount">
      <div v-for="card in computer.cards" :key="card.id" class="card"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.computer {
  position: relative;
}
.cleared {
  &:before {
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

  .name:after {
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
  &:after {
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
}
.passing {
  &:before {
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
  &:after {
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

  &[data-player-rank]:before {
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
  &[data-player-rank="1"]:before {
    content: "\1F4A9大貧民";
    color: #530165;
  }
  &[data-player-rank="2"]:before {
    content: "\1F4B8貧民";
    color: #08507a;
  }
  &[data-player-rank="3"]:before {
    content: "\1F4B0平民";
    color: #1e4a05;
  }
  &[data-player-rank="4"]:before {
    content: "\1F4B4富豪";
    color: #62360c;
  }
  &[data-player-rank="5"]:before {
    content: "\1F451大富豪";
    color: #5e550c;
  }
}

.image {
  text-align: center;
  position: relative;
  width: 70%;
  margin: 2vw auto;
  border-style: solid;
  border-width: 0.5vw;
  border-radius: 1.5vw;

  &:before {
    content: "";
    padding-top: 100%;
    display: block;
  }

  img {
    width: 62.5%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}

.game-end {
  .image:after {
    position: absolute;
    font-weight: 900;
    display: block;
    width: 130%;
    text-align: center;
    font-size: 7vw;
    top: 0.5vw;
    font-family: "M+ 1p black";
    white-space: pre;
    text-shadow: 0.3vw 0.3vw #ffffff, 0vw 0.3vw #ffffff, 0.3vw 0vw #ffffff;
    line-height: 8vw;
    right: -15%;
    left: -15%;
  }
  .name[data-player-next-rank="1"] + .image:after {
    content: "\1F4A9\A大貧民";
    color: #530165;
  }
  .name[data-player-next-rank="2"] + .image:after {
    content: "\1F4B8\A貧民";
    color: #08507a;
  }
  .name[data-player-next-rank="3"] + .image:after {
    content: "\1F4B0\A平民";
    color: #1e4a05;
  }
  .name[data-player-next-rank="4"] + .image:after {
    content: "\1F4B4\A富豪";
    color: #62360c;
  }
  .name[data-player-next-rank="5"] + .image:after {
    content: "\1F451\A大富豪";
    color: #5e550c;
  }
}

.cards {
  text-align: center;
  direction: rtl;
  padding-right: 2.25vw;
  position: relative;
  vertical-align: middle;

  &:after {
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
  &[data-card-count="0"]:after {
    content: "";
  }
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

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Computer from "../models/Computer";

@Component({ name: "Computer" })
export default class ComputerComponent extends Vue {
  @Prop()
  public computer!: Computer;

  @Prop()
  public color!: string;

  @Prop()
  public imageFileName!: string;

  public get bgColor() {
    const match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(
      this.color
    )!;
    const colors = [
      parseInt(match[1], 16),
      parseInt(match[2], 16),
      parseInt(match[3], 16)
    ];
    return `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.2)`;
  }
}
</script>