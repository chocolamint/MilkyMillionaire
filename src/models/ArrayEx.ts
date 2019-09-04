export default class ArrayEx {

    static flatMap<T, S>(xs: T[], f: (elem: T) => S[]): S[] {
        return xs.map(f).reduce((a, b) => a.concat(b));
    }

    static combination<T>(xs: T[], k: number): T[][] {

        const temp = (xs: T[], i: number, k: number): T[][] => {
            if (k == 0) {
                return xs.slice(i).map(x => [x]);
            }
            const ret = [];
            for (let j = i; j < xs.length; j++) {
                const ys = temp(xs, j + 1, k - 1);
                for (const y of ys) {
                    ret.push([xs[j]].concat(y));
                }
            }
            return ret;
        };
        return temp(xs, 0, k - 1);
    }
}
