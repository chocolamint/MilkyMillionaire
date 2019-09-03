export default class Messenger {

    public isShown: boolean;
    public message: string;

    constructor() {
        this.isShown = false;
    }
    async show(message: string, ms: number): Promise<void> {
        this.message = message;
        this.isShown = true;
        console.log('isShown = true');
        return new Promise(resolve => {
            setTimeout(() => {
                this.isShown = false;
                console.log('isShown = false');
                resolve();
            }, ms);
        });
    }
}