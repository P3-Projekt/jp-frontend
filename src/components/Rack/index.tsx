import React from "react";
import ShelfBox from "./Shelf";

interface RackProps {
    name: string;
    locationX: number;
    locationY: number;   
}

const RackBox: React.FC<RackProps> = ({name, locationX, locationY}) => {
    return (
        // Rack container
        <div className="flex flex-col h-[300px] w-[150px] bg-[#2b4e42] rounded-lg p-1">

            {/* Rack name container */}
            <div className="bg-[#2b4e42] rounded-lg mb-1">
                <p className="text-center text-white rounded-lg">{name}</p>
            </div>

            {/* Shelf container */}
            <div className="flex flex-1 flex-col space-y-1">
                <ShelfBox
                    availableSpace={10}
                />
                <ShelfBox
                    availableSpace={20}
                />
                <ShelfBox
                    availableSpace={30}
                />
            </div>
        </div>
    );
};

export default RackBox;