<template>
    <div class="player" :class="{ cleared: player.isCleared, 'game-end': player.isGameEnd, 'trading': player.isTrading }">
        <div class="player-buttons">
          <div class="pass-button player-button" :class="{'enabled':canPass(player)}" v-on:click="canPass(player) ? pass(player) : null">
            パス
          </div>
          <div class="discard-button player-button" :class="{'enabled':canDiscard(field, player)}" v-on:click="canDiscard(field, player) ? discardStaging(player) : null"
                v-show="!player.waitingForNextGame">
            カードを出す
          </div>
          <div class="next-game-button player-button enabled" v-on:click="goToNextGame(player)"
                v-show="player.waitingForNextGame">
            次のゲームへ
          </div>
        </div>
        <div class="name" :class="{ 'turn': player.isMyTurn }" :data-player-rank="player.rank" :data-player-next-rank="player.nextRank">
          {{ player.name }}
        </div>
        <div class="players-cards">
            <div v-for="card in player.cards" :key="card.id" class="card-container">
                <card :card="card" 
                  :class="{ 'staging': card.isStaged, 'disable-stage': isCardGrayedOut(card, player, field) }"
                  v-on:click.native="canStage(card, player, field) ? toggleCardStaging(card) : null"></card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player {
  position: relative;
}
.player.trading:before {
  content: "交換するカードを選んでください";
  border: 1vw #593800 solid;
  padding: 5vw;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  width: 70%;
  margin: auto;
  top: -75%;
  background: #fffaf0;
  border-radius: 2vw;
  font-weight: bold;
  color: #593800;
}

@media screen and (min-device-height: 800px) {
  .player.trading:before {
    top: -100%;
  }
}
.cleared:before {
  content: "あ";
  position: absolute;
  color: #ffffff;
  font-family: "M+ 1p black";
  font-weight: 900;
  background: hsla(51, 94%, 49%, 0.911);
  font-size: 10vw;
  padding: 1vw;
  z-index: 1;
  border-radius: 1vw;
  top: 106%;
  left: 26vw;
  display: inline-block;
  width: 12vw;
  height: 12vw;
  line-height: 12vw;
  vertical-align: middle;
  text-align: center;
  box-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
  text-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
}
.cleared .players-cards:after {
  content: "が";
  position: absolute;
  color: #ffffff;
  font-family: "M+ 1p black";
  font-weight: 900;
  background: hsla(51, 94%, 49%, 0.911);
  font-size: 10vw;
  padding: 1vw;
  z-index: 1;
  border-radius: 1vw;
  top: 134%;
  left: 43vw;
  display: inline-block;
  width: 12vw;
  height: 12vw;
  line-height: 12vw;
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
  font-size: 10vw;
  padding: 1vw;
  z-index: 1;
  border-radius: 1vw;
  top: 120%;
  left: 60vw;
  display: inline-block;
  width: 12vw;
  height: 12vw;
  line-height: 12vw;
  vertical-align: middle;
  text-align: center;
  box-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
  text-shadow: hsla(51, 94%, 20%, 0.911) 0.4vw 0.4vw 0.4vw;
}

.player-buttons {
  display: flex;
  margin: 0 4vw;
}

.player-button {
  background: rgba(32, 32, 32, 0.8);
  border-width: 0.8vw;
  margin: 1vw;
  border-radius: 1.4vw;
  text-align: center;
  font-weight: bold;
  padding: 2.4vw 0;
  position: relative;
  color: #909090;
  font-size: 4.5vw;
}
.player-button.enabled {
  color: #ffffff;
}

.pass-button {
  flex-grow: 5;
}

.pass-button.enabled {
  text-shadow: #06425a;
}

.pass-button:before {
  content: "× ";
}

.pass-button.enabled:after {
  border-style: solid;
  border-color: #ffffff;
  box-shadow: #06425a 0 0 2vw, #06425a 0 0 2vw inset;
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  border-radius: 1.4vw;
}

.discard-button {
  flex-grow: 8;
}
.next-game-button {
  flex-grow: 8;
}

.discard-button:before {
  content: "↑ ";
}
.next-game-button:after {
  content: " →";
}

.discard-button.enabled:after,
.next-game-button.enabled:before {
  border-style: solid;
  border-color: #ffffff;
  box-shadow: #640970 0 0 2vw, #640970 0 0 2vw inset;
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  border-radius: 1.4vw;
}

.name {
  text-indent: -10000vw;
  position: relative;
  height: 0vw;
  border-style: solid;
  border-color: transparent;
  border-bottom-color: #909090;
  border-width: 5vw;
}

.name.turn {
  border-bottom-color: #cc1160;
}

.name[data-player-rank]:after {
  font-weight: 900;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 6vw;
  margin: -4vw 0 0;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  text-indent: 0;
  font-family: "M+ 1p black";
  text-shadow: 0.3vw 0.3vw #ffffff, 0vw 0.3vw #ffffff, 0.3vw 0vw #ffffff;
}

.name[data-player-rank="1"]:after {
  content: "\1F4A9大貧民";
  color: #530165;
}
.name[data-player-rank="2"]:after {
  content: "\1F4B8貧民";
  color: #08507a;
}
.name[data-player-rank="3"]:after {
  content: "\1F4B0平民";
  color: #1e4a05;
}
.name[data-player-rank="4"]:after {
  content: "\1F4B4富豪";
  color: #62360c;
}
.name[data-player-rank="5"]:after {
  content: "\1F451大富豪";
  color: #5e550c;
}

.players-cards {
  display: flex;
  flex-wrap: wrap;
  margin: 1vw 4vw;
}

.game-end .players-cards:after {
  font-weight: 900;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 12vw;
  position: absolute;
  left: 0;
  top: 120%;
  right: 0;
  bottom: 0;
  text-indent: 0;
  font-family: "M+ 1p black";
  text-shadow: 0.3vw 0.3vw #ffffff, 0vw 0.3vw #ffffff, 0.3vw 0vw #ffffff;
  white-space: pre;
  line-height: 14vw;
}

.game-end [data-player-next-rank="1"] + .players-cards:after {
  content: "\1F4A9\A大貧民";
  color: #530165;
}
.game-end [data-player-next-rank="2"] + .players-cards:after {
  content: "\1F4B8\A貧民";
  color: #08507a;
}
.game-end [data-player-next-rank="3"] + .players-cards:after {
  content: "\1F4B0\A平民";
  color: #1e4a05;
}
.game-end [data-player-next-rank="4"] + .players-cards:after {
  content: "\1F4B4\A富豪";
  color: #62360c;
}
.game-end [data-player-next-rank="5"] + .players-cards:after {
  content: "\1F451\A大富豪";
  color: #5e550c;
}

.card-container {
  width: calc(100% / 8 - 0.5vw);
  margin: 0.5vw 0.5vw 0 0;
  box-sizing: border-box;
}

.staging {
  position: relative;
  top: -2vw;
}

.card.disable-stage {
  background: #c0c0c0;
}

.trading
  [data-player-rank="1"]
  + .players-cards
  .card-container:nth-last-child(-n + 2),
.trading [data-player-rank="2"] + .players-cards .card-container:last-child {
  position: relative;
  animation: card-missing 2.5s linear forwards;
}

@keyframes card-missing {
  0% {
    opacity: 1;
    top: 0;
  }
  100% {
    opacity: 0;
    top: -10vw;
  }
}
</style>

<script lang="ts">
import { Card, Player, Field, ArrayEx } from "../models";

export default {
  props: ["player", "field"],
  methods: {
    toggleCardStaging(card: Card) {
      card.isStaged = !card.isStaged;
    },
    pass(player: Player) {
      player.pass();
    },
    discardStaging(player: Player) {
      if (this.isUnnecessaryCardSelecting(player)) {
        player.giveStagings();
      } else {
        player.discardStaging();
      }
    },
    canDiscard(field: Field, player: Player) {
      if (this.isUnnecessaryCardSelecting(player)) {
        const missingCount = player.rank - 3;
        return player.stagings().length == missingCount;
      }
      return field.canDiscard(player.stagings());
    },
    isUnnecessaryCardSelecting(player: Player) {
      return player.isTrading && player.rank >= 4;
    },
    isCardGrayedOut(card: Card, player: Player, field: Field) {
      if (this.isUnnecessaryCardSelecting(player)) {
        return !this.canStage(card, player, field);
      }
      return player.isMyTurn && !this.canStage(card, player, field);
    },
    canStage(card: Card, player: Player, field: Field) {
      const stagings = player.stagings();

      if (this.isUnnecessaryCardSelecting(player)) {
        const missingCount = player.rank - 3;
        return stagings.length < missingCount || stagings.indexOf(card) != -1;
      }

      if (!player.isMyTurn) return false;

      const top = field.top();
      if (stagings.length == 0) {
        if (top == null) return true;
        const discardables = ArrayEx.combination(
          player.cards,
          top.length
        ).filter(xs => field.canDiscard(xs));
        return discardables.some(xs => xs.indexOf(card) != -1);
      } else {
        return (
          field.canDiscard(stagings.concat(card)) ||
          stagings.indexOf(card) != -1
        );
      }
    },
    canPass(player: Player) {
      return player.isMyTurn;
    },
    goToNextGame(player: Player) {
      player.goToNextGame();
    }
  }
};
</script>