import { Stage, Layer, Text, Image } from "react-konva";
import { useState, useRef } from "react";
import konva from "konva";
import useImage from "use-image";
import { KonvaEventObject } from "konva/types/Node";
import { Vector2d } from "konva/types/types";
import { Input } from "../components/input";

type Object = Vector2d & {
    src: string;
    selected: boolean;
};

export default function Home() {
    const [items, setItems] = useState<Object[]>([]);
    const stageRef = useRef<konva.Stage>();
    const dragUrl = useRef<string>();
    const [backgroundImage] = useImage("https://i.imgur.com/JBJy19Z.png");

    const checkDeselect = (e: KonvaEventObject<MouseEvent>) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            items.forEach((i) => (i.selected = false));
        }
    };

    const onDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        dragUrl.current = e.currentTarget.src;
    };

    return (
        <>
            <Menu onDragStart={onDragStart} />
            <div
                onDrop={(e) => {
                    e.preventDefault();
                    stageRef.current.setPointersPositions(e);
                    setItems(
                        items.concat([
                            {
                                ...stageRef.current.getPointerPosition(),
                                src: dragUrl.current,
                                selected: false,
                            },
                        ])
                    );
                }}
                onDragOver={(e) => e.preventDefault()}
            >
                <Stage
                    width={1600}
                    height={800}
                    ref={stageRef}
                    onMouseDown={checkDeselect}
                >
                    <Layer>
                        <Image
                            image={backgroundImage}
                            width={stageRef.current && stageRef.current.width()}
                            height={
                                stageRef.current && stageRef.current.height()
                            }
                        />

                        {items.map((item) => (
                            <URLImage
                                image={item}
                                onSelect={() => {
                                    item.selected = true;
                                }}
                                selected={true}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </>
    );
}

const URLImage = ({
    image,
    onSelect,
    selected,
}: {
    image: Object;
    onSelect: () => void;
    selected: boolean;
}) => {
    const [img] = useImage(image.src);

    return (
        <>
            <Image
                image={img}
                x={image.x}
                y={image.y}
                offsetX={img ? img.width / 2 : 0}
                offsetY={img ? img.height / 2 : 0}
                draggable={selected}
                onClick={onSelect}
            />
        </>
    );
};

const Menu = ({
    onDragStart,
}: {
    onDragStart: (event: React.DragEvent<HTMLImageElement>) => void;
}) => (
    <div>
        Test
        <img src="IconSmall_RaidStar.png" draggable onDragStart={onDragStart} />
        <Input />
    </div>
);
