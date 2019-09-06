<template>
  <div class="main">
    <ul class="computers">
      <li v-for="computer in computers" :key="computer.name">
        <computer
          :computer="computer.computer"
          :color="computer.color"
          :imageFileName="computer.imageFileName"
        ></computer>
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
    <player :player="player.player" :rule="rule" class="player"></player>
    <div class="message" v-if="messenger.isShown">
      <div class="message-text">{{ messenger.message }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.computers {
  display: flex;
  flex-wrap: nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;

  &:before {
    content: "";
    padding-top: 20%;
    display: block;
  }

  li {
    width: 25%;
  }
}
.field {
  width: 100%;
  position: relative;

  &:before {
    content: "";
    padding-top: 40%;
    display: block;
  }

  .card-set {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -14vw;
    left: -3vw;
    right: 0;
    bottom: 0;

    &:nth-last-child(1),
    &:nth-last-child(2) {
      left: 0;
      top: 0;
    }

    &:nth-last-child(2) {
      top: -14vw;
      left: -3vw;
      animation: discarded-cards-2 1.3s lenear;

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

      .card {
        background: #c0c0c0;
      }
    }

    .card-container {
      width: calc(100% / 8 - 0.5vw);
      margin: 0.5vw 0.5vw 0 0;
      box-sizing: border-box;
    }
  }
}
@media screen and (min-device-height: 800px) {
  .field:before {
    padding-top: 60%;
  }
}
.card-discard-enter {
  &[data-discarded-by="0"] {
    transform: translate(-30vw, -20vw);
  }
  &[data-discarded-by="1"] {
    transform: translate(-13vw, -20vw);
  }
  &[data-discarded-by="2"] {
    transform: translate(13vw, -20vw);
  }
  &[data-discarded-by="3"] {
    transform: translate(30vw, -20vw);
  }
  &[data-discarded-by="-1"] {
    transform: translate(0, 20vw);
  }
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

  .message-text {
    color: #ffffff;
    font-size: 6vw;
    font-weight: 900;
    display: inline-block;
    font-family: "M+ 1p black";
  }
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Card, allCards } from "../models/Card";
import Character from "../models/Character";
import Computer from "../models/Computer";
import Messenger from "../models/Messenger";
import Player from "../models/Player";
import Rule from "../models/Rule";
import Stack from "../models/Stack";
import CardComponent from "./Card/Card.vue";
import ComputerComponent from "./Computer/Computer.vue";
import PlayerComponent from "./Player/Player.vue";
import CardSet from "../models/CardSet";
import { concat, sleep } from "../models/Utils";
import _ from "lodash";
import { Turn } from "../models/Turn";

class ComputerViewModel {
  constructor(public computer: Computer, public color: string, public imageFileName: string) { }
}
class PlayerViewModel {
  constructor(public player: Player, public color: string) { }
}

@Component({
  components: {
    card: CardComponent,
    computer: ComputerComponent,
    player: PlayerComponent
  }
})
export default class AppComponent extends Vue {

  private computers = [
    new ComputerViewModel(new Computer("パクチー"), "#F189C8", "vegetable_pakuchi_coriander.png"),
    new ComputerViewModel(new Computer("日本酒"), "#34BD67", "masu_nihonsyu.png"),
    new ComputerViewModel(new Computer("餃子"), "#26C4F0", "food_gyouza_mise.png"),
    new ComputerViewModel(new Computer("かまぼこ"), "#C97842", "kamaboko_red.png")
  ];
  private player = new PlayerViewModel(new Player("台湾まぜそば"), "#F1A15B");
  private messenger = new Messenger();
  private stack = new Stack();
  private rule = new Rule();

  public constructor() {
    super();
  }

  mounted() {
    this.beginGame();
  }

  async beginGame() {

    const characters = concat(this.computers.map(x => x.computer), [this.player.player]);

    for (const character of characters) {
      character.logger = this;
    }

    const cards = allCards();
    let lastDiscard: Character | null;
    let passCount: number = 0;
    const deal = (characters: Character[], cards: Card[]) => {
      let i = 0;
      for (const card of _.shuffle(cards)) {
        characters[i++ % 5].deal(card);
      }
    };
    const pass = (character: Character) => {
      console.log(`${character.name}がパスしました`);
    };
    const discard = (character: Character, cards: Card[]) => {

      console.log(`${character.name}が${cards.map(x => x.toString()).join(',')}を捨てました`);

      lastDiscard = character;
      passCount = 0;
      this.stack.push(new CardSet(cards, character.name));
    };
    const trade = async () => {
      const tradings: Record<number, Card[]> = {};
      for (const character of characters) {
        tradings[character.rank] = await character.giveCards(this.rule);
      }
      for (const character of characters) {
        for (const card of tradings[6 - character.rank]) {
          character.deal(card);
        }
      }
    };
    const doGame = async () => {

      const ranking = [];

      deal(characters, cards);

      console.log('カードの交換を開始します');
      await trade();
      console.log('カードの交換を終了します');

      await this.messenger.show('ゲームスタート', 1000);

      let nextDealer = _.sample(characters);
      console.log(`${nextDealer!.name}の親ではじめます`);
      let turnCount = 0;
      let isGameEnd = false;
      while (true) {
        for (const character of characters) {
          if (lastDiscard == character) {
            console.log(`最後にカードを捨てた${lastDiscard.name}の番が回ってきたので次の親になります`);
            this.stack.clear();
            lastDiscard = null;
            await sleep(500);
          }
          if (nextDealer != null && character != nextDealer) continue;
          nextDealer = undefined;
          if (character.isCleared) {
            console.log(`${character.name}はあがっているので飛ばします`);
            continue;
          }

          const result = await character.turn(new Turn(this.stack, this.rule, turnCount));
          if (result.action == "pass") {
            pass(character);
          } else {
            discard(character, result.cards);
            await sleep(500);
          }

          if (character.isCleared) {
            ranking.unshift(character);
          }

          isGameEnd = characters.filter(x => x.isCleared).length == 4;
          if (isGameEnd) break;
        }
        if (isGameEnd) break;
        turnCount++;
      }
      lastDiscard = null;
      passCount = 0;
      this.stack.clear();

      for (const character of characters) {
        // 早くあがったキャラクターほど後ろに入っており、最後のキャラクターは入っていないため -1 が返る
        // そのため +1 すると 1～5 になる
        character.nextRank = ranking.indexOf(character) + 2;
        character.endGame();
      }

      await this.messenger.show('ゲームセット', 1000);

      console.log('結果を発表してプレーヤーの確認待ち');
      for (const character of characters) {
        await character.nextGame();
      }
      console.log('次のゲームを開始します');
    };

    while (true) {
      await doGame();
    }
  }

  public whereFrom(cards: CardSet): number {
    return this.computers.findIndex(x => x.computer.name == cards.holder);
  }

  log<TSource>(message: string, source?: TSource) {
    if (source instanceof Character) {
      const color = source instanceof Computer
        ? this.computers.find(x => x.computer == source)!.color
        : this.player.color;
      console.log(`%c${source.name}: ${message}`, `color:${color}`);
    } else {
      console.log(message);
    }
  }
}
</script>