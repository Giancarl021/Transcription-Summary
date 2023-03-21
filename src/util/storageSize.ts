export function bits(b: number) {
    return b / 8;
}

export function bytes(B: number) {
    return B;
}

export function kilobytes(kB: number) {
    return bytes(kB) * 1000;
}

export function megabytes(MB: number) {
    return kilobytes(MB) * 1000;
}

export function gigabytes(GB: number) {
    return megabytes(GB) * 1000;
}
