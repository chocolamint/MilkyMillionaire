import { sleep } from "./Utils";

export default class Messenger {

    public isShown: boolean;
    public message: string = "";

    constructor() {
        this.isShown = false;
    }
    async show(message: string, ms: number): Promise<void> {
        this.message = message;
        this.isShown = true;
        await sleep(ms);
        this.isShown = false;
        this.message = "";
    }
}