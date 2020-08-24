import * as t from "io-ts";

interface GreaterThanNumber<N> {
    readonly GreaterThanNumber: unique symbol;
    readonly minimum: N;
}

export const GreaterThanNumber = <N extends number>(minimum: N) =>
    t.brand(
        t.number,
        (s): s is t.Branded<number, GreaterThanNumber<N>> => s > minimum,
        "GreaterThanNumber"
    );
