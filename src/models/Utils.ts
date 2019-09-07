export function combination<T>(xs: ReadonlyArray<T>, k: number): T[][] {

    const temp = (xs: ReadonlyArray<T>, i: number, k: number): T[][] => {
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

export function concat<T, S>(x: T[], y: S[]): Array<T | S> {
    return (x as Array<T | S>).concat(y);
}

export function filterNotNull<T>(xs: Array<T | null>): T[] {
    return xs.filter(x => x !== null) as T[];
}

export function sleep(delayMilliseconds: number) {
    return new Promise<void>(resolve => setTimeout(resolve, delayMilliseconds));
}

export interface ILogger {
    log<TSource>(message: string, source?: TSource): void;
}