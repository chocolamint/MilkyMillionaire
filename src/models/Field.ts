import Card from "./Card";
import Messenger from "./Messenger";
import Computer from "./Computer";
import Player from "./Player";
import Character from "./Character";
import _ from "lodash";
import { sleep } from "./Utils";
import Stack from "./Stack";

export default class Field {

    private _computers: Computer[];
    private _player: Player;
    private _passCount: number;
    private _lastDiscard: Character;
    public messenger: Messenger;
    public stack: Stack;

    constructor(messenger: Messenger) {
        this._passCount = 0;
        this._lastDiscard = null;
        this.messenger = messenger;
        this.stack = new Stack();
    }
    private pass(character: Character) {

        console.log(`${character.name}がパスしました`);
    }
    private discard(character: Character, cards: Card[]) {

        console.log(`${character.name}が${cards.map(x => x.toString()).join(',')}を捨てました`);

        this._lastDiscard = character;
        this._passCount = 0;
        this.stack.push(cards, this._computers.indexOf(character as any));
    }
    static deal(characters: Character[], cards: Card[]) {
        let i = 0;
        for (const card of _.shuffle(cards)) {
            characters[i++ % 5].cards.push(card);
        }
    }
    async beginGame(characters: Character[], cards: Card[]) {

        this._computers = characters.filter(x => x instanceof Computer) as Computer[];
        this._player = characters.filter(x => x instanceof Player)[0] as Player;

        const doGame = async () => {

            const ranking = [];

            Field.deal(characters, cards);

            //let i = 0;
            for (const character of characters) {
                character.cards.sort(Card.compareSort);
                //character.rank = ++i;
            }

            console.log('カードの交換を開始します');
            const tradings: Record<number, Card[]> = {};
            for (const character of characters) {
                tradings[character.rank] = await character.giveCards();
            }
            for (const character of characters) {
                for (const card of tradings[6 - character.rank]) {
                    character.cards.push(card);
                }
                character.cards.sort(Card.compareSort);
            }
            console.log('カードの交換を終了します');

            await this.messenger.show('ゲームスタート', 1000);

            let nextDealer = _.sample(characters);
            console.log(`${nextDealer.name}の親ではじめます`);
            let turnCount = 0;
            let isGameEnd = false;
            while (true) {
                for (const character of characters) {
                    if (this._lastDiscard == character) {
                        console.log(`最後にカードを捨てた${this._lastDiscard.name}の番が回ってきたので次の親になります`);
                        this.stack.clear();
                        this._lastDiscard = null;
                        await sleep(500);
                    }
                    if (nextDealer != null && character != nextDealer) continue;
                    nextDealer = null;
                    if (character.isCleared) {
                        console.log(`${character.name}はあがっているので飛ばします`);
                        continue;
                    }

                    const result = await character.turn(this.stack, turnCount);
                    if (result.action == "pass") {
                        this.pass(character);
                    } else {
                        this.discard(character, result.cards);
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
            this._lastDiscard = null;
            this._passCount = 0;
            this.stack.clear();

            for (const character of characters) {
                // 早くあがったキャラクターほど後ろに入っており、最後のキャラクターは入っていないため -1 が返る
                // そのため +1 すると 1～5 になる
                character.nextRank = ranking.indexOf(character) + 2;
                character.endGame();
            }

            await this.messenger.show('ゲームセット', 1000);

            console.log('結果を発表してプレーヤーの確認待ち');
            await this._player.waitForNextGame();
            console.log('次のゲームを開始します');

            for (const character of characters) {
                character.nextGame();
            }
        };

        while (true) {
            await doGame();
        }
    }
}

