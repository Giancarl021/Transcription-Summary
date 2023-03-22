export function milliseconds(ms: number) {
    return ms;
}

export function seconds(s: number) {
    return milliseconds(s) * 1000;
}

export function minutes(m: number) {
    return seconds(m) * 60;
}

export function hours(h: number) {
    return minutes(h) * 60;
}
