import ArrayEx from "./ArrayEx";
import Card from "./Card";
import Character from "./Character";

// TODO 酷い循環参照
declare var field: any;

export default class Computer extends Character {

    public passing: boolean;
    public image: string;

    constructor(name: string, color: string, image: string) {
        super(name, color);
        this.passing = false;
        this.image = image;
    }
    turnCore(turnCount: number) {

        const top: Card[] | null = field.top();
        let discardable;
        if (top != null) {
            const fieldCardCount = top.length;
            const discardables = ArrayEx.combination(this.cards, fieldCardCount).filter(x => field.canDiscard(x));
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
            discardable = strategicPass ? null : ArrayEx.random(discardables);

        } else {
            const discardables = ArrayEx.flatMap(ArrayEx.range(1, 4), x => ArrayEx.combination(this.cards, x))
                .filter(x => field.canDiscard(x));
            this.say(`捨てられるのは... ${discardables.map(x => x.join('')).join(', ')}`);
            // TODO: 弱いものほど捨てやすくしたい
            discardable = ArrayEx.random(discardables);
        }

        if (discardable == null) {
            this.passing = true;
            this.pass();
        } else {
            this.discard(discardable);
        }

        setTimeout(() => {
            this.passing = false;
            this.turnEnd();
        }, 500);
    }
}
