import { Component, Vue, Prop } from "vue-property-decorator";
import Computer from "@/models/Computer";

@Component({ name: "Computer" })
export default class ComputerComponent extends Vue {
    @Prop()
    public computer!: Computer;

    @Prop()
    public color!: string;

    @Prop()
    public imageFileName!: string;

    public get bgColor() {
        const match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(
            this.color
        )!;
        const colors = [
            parseInt(match[1], 16),
            parseInt(match[2], 16),
            parseInt(match[3], 16)
        ];
        return `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.2)`;
    }
}