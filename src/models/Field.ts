import Card from "./Card";
import Messenger from "./Messenger";
import Character from "./Character";
import _ from "lodash";
import { sleep } from "./Utils";
import Stack from "./Stack";

export default class Field {

    async beginGame(characters: Character[], cards: Card[], stack: Stack, messenger: Messenger) {

        let lastDiscard: Character;
        let passCount: number = 0;
        const deal = (characters: Character[], cards: Card[]) => {
            let i = 0;
            for (const card of _.shuffle(cards)) {
                characters[i++ % 5].cards.push(card);
            }
        };
        const pass = (character: Character) => {
            console.log(`${character.name}がパスしました`);
        };
        const discard = (character: Character, cards: Card[]) => {

            console.log(`${character.name}が${cards.map(x => x.toString()).join(',')}を捨てました`);

            lastDiscard = character;
            passCount = 0;
            stack.push(cards, characters.indexOf(character));
        };
        const doGame = async () => {

            const ranking = [];

            deal(characters, cards);

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

            await messenger.show('ゲームスタート', 1000);

            let nextDealer = _.sample(characters);
            console.log(`${nextDealer.name}の親ではじめます`);
            let turnCount = 0;
            let isGameEnd = false;
            while (true) {
                for (const character of characters) {
                    if (lastDiscard == character) {
                        console.log(`最後にカードを捨てた${lastDiscard.name}の番が回ってきたので次の親になります`);
                        stack.clear();
                        lastDiscard = null;
                        await sleep(500);
                    }
                    if (nextDealer != null && character != nextDealer) continue;
                    nextDealer = null;
                    if (character.isCleared) {
                        console.log(`${character.name}はあがっているので飛ばします`);
                        continue;
                    }

                    const result = await character.turn(stack, turnCount);
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
            stack.clear();

            for (const character of characters) {
                // 早くあがったキャラクターほど後ろに入っており、最後のキャラクターは入っていないため -1 が返る
                // そのため +1 すると 1～5 になる
                character.nextRank = ranking.indexOf(character) + 2;
                character.endGame();
            }

            await messenger.show('ゲームセット', 1000);

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
}

