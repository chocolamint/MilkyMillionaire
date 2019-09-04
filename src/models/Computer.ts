import _ from "lodash";
import { combination, sleep } from "./Utils";
import Card from "./Card";
import Character from "./Character";
import Stack from "./Stack";
import Rule from "./Rule";

export default class Computer extends Character {

    public passing: boolean;
    public image: string;
    private _rule: Rule;

    constructor(name: string, image: string, rule: Rule) {
        super(name);
        this.passing = false;
        this.image = image;
        this._rule = rule;
    }
    async turnCore(stack: Stack, turnCount: number) {

        const top = stack.top();
        let discardable: Card[];
        if (top != null) {
            const fieldCardCount = top.length;
            const discardables = combination(this.cards, fieldCardCount).filter(x => this._rule.canDiscard(stack, x));
            this.say(`捨てられるのは... ${discardables.length ? discardables.map(x => x.join('')).join(', ') : 'ないですね...'}`);
            let strategicPass = false;
            if (discardables.length != 0) {
                // ターンが早くてかつ捨てないといけないカードのランクが高いほどパスしやすくする
                const turnRatio = Math.max((- (turnCount + 1) + 10) / 10, 0);
                // TODO: 実際に捨てないといけないカードのランクの高さでパスしやすさを決めたいが、弱いものほど捨てやすいロジックになっていないと意味がないのでまたあとで
                const fieldRank = top.filter(x => !x.isJoker)[0].rankLevel();
                const passRatio = turnRatio * (fieldRank * fieldRank / 169);
                this.say(`${turnCount + 1}ターン目で${fieldRank}という高さ…パスしたさは${Math.round(passRatio * 100)}%くらいかな...`)
                if (Math.random() < passRatio) {
                    strategicPass = true;
                    this.say(`戦略的パスします`);
                }
            }
            // TODO: 弱いものほど捨てやすくしたい
            discardable = strategicPass ? null : _.sample(discardables);

        } else {
            const discardables = _.range(1, 5).flatMap(x => combination(this.cards, x))
                .filter(x => this._rule.canDiscard(stack, x));
            this.say(`捨てられるのは... ${discardables.map(x => x.join('')).join(', ')}`);
            // TODO: 弱いものほど捨てやすくしたい
            discardable = _.sample(discardables);
        }

        if (discardable == null) {
            this.passing = true;
            await sleep(500);
            this.pass();
            this.passing = false;
        } else {
            this.discard(discardable);
        }
    }
}
