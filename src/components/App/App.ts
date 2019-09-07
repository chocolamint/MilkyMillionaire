
import { Component, Vue, Prop } from "vue-property-decorator";
import { Card, allCards } from "@/models/Card";
import Character from "@/models/Character";
import Computer from "@/models/Computer";
import Messenger from "@/models/Messenger";
import Player from "@/models/Player";
import Rule from "@/models/Rule";
import Stack from "@/models/Stack";
import CardComponent from "@/components/Card/Card.vue";
import ComputerComponent from "@/components/Computer/Computer.vue";
import PlayerComponent from "@/components/Player/Player.vue";
import CardSet from "@/models/CardSet";
import { concat, sleep } from "@/models/Utils";
import _ from "lodash";
import { Turn } from "@/models/Turn";

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
        player: PlayerComponent,
    },
})
export default class AppComponent extends Vue {

    private computers = [
        new ComputerViewModel(new Computer("パクチー"), "#F189C8", "vegetable_pakuchi_coriander.png"),
        new ComputerViewModel(new Computer("日本酒"), "#34BD67", "masu_nihonsyu.png"),
        new ComputerViewModel(new Computer("餃子"), "#26C4F0", "food_gyouza_mise.png"),
        new ComputerViewModel(new Computer("かまぼこ"), "#C97842", "kamaboko_red.png"),
    ];
    private player = new PlayerViewModel(new Player("台湾まぜそば"), "#F1A15B");
    private messenger = new Messenger();
    private stack = new Stack();
    private rule = new Rule();

    public constructor() {
        super();
    }

    public mounted() {
        this.beginGame();
    }

    public async beginGame() {

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

            console.log(`${character.name}が${cards.map(x => x.toString()).join(",")}を捨てました`);

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

            console.log("カードの交換を開始します");
            await trade();
            console.log("カードの交換を終了します");

            await this.messenger.show("ゲームスタート", 1000);

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

            await this.messenger.show("ゲームセット", 1000);

            console.log("結果を発表してプレーヤーの確認待ち");
            for (const character of characters) {
                await character.nextGame();
            }
            console.log("次のゲームを開始します");
        };

        while (true) {
            await doGame();
        }
    }

    public whereFrom(cards: CardSet): number {
        return this.computers.findIndex(x => x.computer.name == cards.holder);
    }

    public log<TSource>(message: string, source?: TSource) {
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