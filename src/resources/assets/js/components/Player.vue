<template>
    <div class="player" :class="{ cleared: player.isCleared }">
        <div class="player-buttons">
          <div class="pass-button player-button" :class="{'enabled':canPass(player)}" v-on:click="canPass(player) ? pass(player) : null">
            パス
          </div>
          <div class="discard-button player-button" :class="{'enabled':canDiscard(field, player)}" v-on:click="canDiscard(field, player) ? discardStaging(player) : null">
            カードを捨てる
          </div>
        </div>
        <div class="name" :class="{ 'turn': player.isMyTurn }" :data-player-rank="player.rank">
          {{ player.name }}
        </div>
        <div class="players-cards">
            <div v-for="card in player.cards" :key="card.id" class="card-container">
                <card :card="card" 
                  :class="{ 'staging': card.isStaged, 'disable-stage': player.isMyTurn && !canStage(card, player, field) }"
                  v-on:click.native="player.isMyTurn && canStage(card, player, field) ? toggleCardStaging(card) : null"></card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player {
  position: relative;
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

.discard-button:before {
  content: "↑ ";
}

.discard-button.enabled:after {
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
  color: #08507A;
}
.name[data-player-rank="3"]:after {
  content: "\1F4B4平民";
  color: #1E4A05;
}
.name[data-player-rank="4"]:after {
  content: "\1F4B4富豪";
  color: #62360C;
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
</style>

<script>
import { Card, ArrayEx } from "../models.js";

export default {
  props: ["player", "field"],
  methods: {
    toggleCardStaging(card) {
      card.isStaged = !card.isStaged;
    },
    pass(player) {
      player.pass();
    },
    discardStaging(player) {
      player.discardStaging();
    },
    canDiscard(field, player) {
      return field.canDiscard(player.stagings());
    },
    canStage(card, player, field) {
      const stagings = player.stagings();
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
    canPass(player) {
      return player.isMyTurn;
    }
  }
};
</script>