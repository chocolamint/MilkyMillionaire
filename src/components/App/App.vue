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
@import "./App.scss";
</style>

<script lang="ts" src="./App.ts"></script>
