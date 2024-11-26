import React from "react";
import ShelfBox from "./Shelf";

interface RackProps {
    id: number;
    numberOfShelves: number;
    locationX: number;
    locationY: number;
}

const RackBox: React.FC<RackProps> = ({id, numberOfShelves, locationX, locationY}) => {
    return (
        // Rack container
        <div className="flex flex-col h-[300px] w-[150px] bg-colorprimary rounded-lg p-1">

            {/* Rack name container */}
            <div className="bg-colorprimary rounded-lg mb-1">
                <p className="text-center text-white rounded-lg">{`Reol #${id}`}</p>
            </div>

            {/* Shelf container */}
            <div className="flex flex-1 flex-col space-y-1">
                {Array.from({ length: numberOfShelves }).map((_, index) => (
                    <ShelfBox
                        key={`${id}#${index}`}
                        index={index}
                        rack={id}
                    />
                ))}
            </div>
        </div>
    );
};

export default RackBox;