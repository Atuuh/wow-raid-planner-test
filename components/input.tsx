import { useRef, useState } from "react";
import * as t from "io-ts";
import { pipe, flow } from "fp-ts/lib/function";
import {
    fold,
    left,
    chain,
    map,
    parseJSON,
    mapLeft,
    Either,
    Json,
} from "fp-ts/lib/Either";
import { PathReporter } from "io-ts/PathReporter";
import { GreaterThanNumber } from "./greaterThanNumber";

const mapDecodeError: <A extends unknown>(
    value: Either<t.Errors, A>
) => Either<string, A> = mapLeft((errors) =>
    PathReporter.report(left(errors)).join("\n")
);

const decodeUser: (user: Either<string, Json>) => Either<string, User> = flow(
    chain((u) => pipe(t.exact(User).decode(u), mapDecodeError))
);

export const Input = () => {
    const ref = useRef<HTMLInputElement>();
    const [data, setData] = useState("");
    const [errors, setErrors] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setData("");
        setErrors("");

        pipe(
            decodeURI(ref.current.value),
            (s) => parseJSON(s, () => "Error parsing JSON"),
            decodeUser,
            map((user) => JSON.stringify(user, null, 2)),
            fold(setErrors, setData)
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" ref={ref} />
            <pre>
                Data: <br />
                {data}
            </pre>
            <pre>
                Errors: <br />
                {errors}
            </pre>
        </form>
    );
};

const User = t.type({
    name: t.string,
    age: GreaterThanNumber(18),
});
type User = t.TypeOf<typeof User>;
