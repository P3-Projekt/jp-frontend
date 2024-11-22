import React from "react";
import ShelfBox from "./Shelf";
import { useShelfContext } from "@/app/pregermination/shelfcontext";

interface RackProps {
    name: string;
    id: number;
    numberOfShelves: number;
    locationX: number;
    locationY: number;
}

const RackBox: React.FC<RackProps> = ({name, id, numberOfShelves, locationX, locationY}) => {
    const { shelves } = useShelfContext();

    return (
        // Rack container
        <div className="flex flex-col h-[300px] w-[150px] bg-[#2b4e42] rounded-lg p-1">

            {/* Rack name container */}
            <div className="bg-[#2b4e42] rounded-lg mb-1">
                <p className="text-center text-white rounded-lg">{name}</p>
            </div>

            {/* Shelf container */}
            <div className="flex flex-1 flex-col space-y-1">
                {Array.from({ length: numberOfShelves }).map((_, index) => (
                    <ShelfBox
                        key={`${id}#${index}`}
                        inputVisible={shelves[index]?.inputVisible ?? false}
                        availableSpace={shelves[index]?.availableSpace ?? 0}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default RackBox;