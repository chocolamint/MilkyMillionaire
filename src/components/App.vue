<template>
  <div class="main">
    <ul class="computers">
      <li v-for="computer in computers" :key="computer.name">
        <computer :computer="computer" :color="getColor(computer)"></computer>
      </li>
    </ul>
    <div class="field">
      <transition-group name="card-discard" tag="div">
        <div
          v-for="cardSet in stack.cards"
          :key="cardSet.id"
          class="card-set"
          :data-discarded-by="whereFrom(cardSet)"
        >
          <div v-for="card in cardSet.cards" :key="card.id" class="card-container">
            <card :card="card"></card>
          </div>
        </div>
      </transition-group>
    </div>
    <player :player="player" class="player"></player>
    <div class="message" v-if="messenger.isShown">
      <div class="message-text">{{ messenger.message }}</div>
    </div>
  </div>
</template>

<style scoped>
.computers {
  display: flex;
  flex-wrap: nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}
.computers:before {
  content: "";
  padding-top: 20%;
  display: block;
}
.computers li {
  width: 25%;
}
.field {
  width: 100%;
  position: relative;
}
.field:before {
  content: "";
  padding-top: 40%;
  display: block;
}
@media screen and (min-device-height: 800px) {
  .field:before {
    padding-top: 60%;
  }
}
.field .card-set {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -14vw;
  left: -3vw;
  right: 0;
  bottom: 0;
}
.field .card-set .card-container {
  width: calc(100% / 8 - 0.5vw);
  margin: 0.5vw 0.5vw 0 0;
  box-sizing: border-box;
}
.field .card-set:nth-last-child(1),
.field .card-set:nth-last-child(2) {
  left: 0;
  top: 0;
}
.field .card-set:nth-last-child(2) {
  top: -14vw;
  left: -3vw;
  animation: discarded-cards-2 1.3s lenear;
}

@keyframes discarded-cards-2 {
  0% {
    top: 0;
    left: 0;
  }
  100% {
    top: -14vw;
    left: -3vw;
  }
}

.field .card-set:nth-last-child(2) .card {
  background: #c0c0c0;
}
.card-discard-enter[data-discarded-by="0"] {
  transform: translate(-30vw, -20vw);
}
.card-discard-enter[data-discarded-by="1"] {
  transform: translate(-13vw, -20vw);
}
.card-discard-enter[data-discarded-by="2"] {
  transform: translate(13vw, -20vw);
}
.card-discard-enter[data-discarded-by="3"] {
  transform: translate(30vw, -20vw);
}
.card-discard-enter[data-discarded-by="-1"] {
  transform: translate(0, 20vw);
}
.card-discard-enter-active {
  transition: transform 0.3s linear;
  transform: translate(0, 0);
}
.card-discard-leave-active {
  transition: transform 0.3s linear;
  transform: translate(0, 0);
}
.card-discard-leave-to {
  transform: translate(-60vw, 0);
}
.player {
  width: 100%;
}

.message {
  position: fixed;
  top: 23%;
  height: 27%;
  left: 0;
  right: 0;
  background: rgba(10, 10, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.message .message-text {
  color: #ffffff;
  font-size: 6vw;
  font-weight: 900;
  display: inline-block;
  font-family: "M+ 1p black";
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "../models/Card";
import Character from "../models/Character";
import Computer from "../models/Computer";
import Croupier from "../models/Croupier";
import Messenger from "../models/Messenger";
import Player from "../models/Player";
import Rule from "../models/Rule";
import Stack from "../models/Stack";
import CardComponent from "./Card.vue";
import ComputerComponent from "./Computer.vue";
import PlayerComponent from "./Player.vue";
import CardSet from "../models/CardSet";

@Component({
  components: {
    card: CardComponent,
    computer: ComputerComponent,
    player: PlayerComponent
  }
})
export default class AppComponent extends Vue {
  messenger: Messenger;
  rule: Rule;
  croupier: Croupier;
  computers: Computer[];
  player: Player;
  stack: Stack;
  colors = ["#F189C8", "#34BD67", "#26C4F0", "#C97842", "#F1A15B"];

  public constructor() {
    super();
    this.messenger = new Messenger();
    this.rule = new Rule();
    this.croupier = new Croupier();
    this.computers = [
      new Computer("パクチー", "vegetable_pakuchi_coriander.png", this.rule),
      new Computer("日本酒", "masu_nihonsyu.png", this.rule),
      new Computer("餃子", "food_gyouza_mise.png", this.rule),
      new Computer("かまぼこ", "kamaboko_red.png", this.rule)
    ];
    this.player = new Player("台湾まぜそば", this.rule);
    this.stack = new Stack();

    const characters = [...this.computers, this.player];
    for (const character of characters) {
      character.logger = this;
    }

    this.croupier.beginGame(characters, this.stack, this.messenger);
  }

  public whereFrom(cards: CardSet): number {
    return this.computers.findIndex(x => x.name == cards.holder);
  }

  public getColor(character: Character) {
    const index =
      character instanceof Computer ? this.computers.indexOf(character) : 4;
    return this.colors[index];
  }

  log<TSource>(message: string, source?: TSource) {
    if (source instanceof Character) {
      const color = this.getColor(source);
      console.log(`%c${source.name}: ${message}`, `color:${color}`);
    } else {
      console.log(message);
    }
  }
}
</script>