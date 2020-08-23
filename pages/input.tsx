import { useRef, useState } from "react";

type Event =
    | React.FormEvent<HTMLFormElement>
    | React.ClipboardEvent<HTMLFormElement>;
export const Input = () => {
    const ref = useRef<HTMLInputElement>();
    const [data, setData] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setData(ref.current.value);
    };

    let v: any;
    try {
        v = JSON.parse(data);
    } catch (e) {}

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" ref={ref} />
            <pre>{JSON.stringify(v, null, 2)}</pre>
        </form>
    );
};

const parseData = (json: string) => {};
