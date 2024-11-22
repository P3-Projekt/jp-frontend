import { useShelfContext } from "@/app/pregermination/shelfcontext";
import React from "react";

interface Shelf {
    inputVisible: boolean;
    availableSpace: number;
}

interface ShelfProps {
    inputVisible: boolean;
    availableSpace: number;
    index: number;
}

const ShelfBox: React.FC<ShelfProps> = ({index, inputVisible,  availableSpace}) => {
    const { updateShelfData } = useShelfContext();

    const handleChangeAvailableSpace = (newInputVisible: boolean, newAvailableSpace: number) => {
        updateShelfData(index, {inputVisible: newInputVisible, availableSpace: newAvailableSpace})
    }

    return (
        // Shelf container
        <div className="flex-1 flex items-center justify-center rounded-lg bg-[#a5a4a2]">
            {inputVisible &&
                <div className="flex items-center">
                    <div className="w-6 h-4 bg-[#f3f2f0] rounded border border-[#2b4e42]"/>
                    <div className="text-black text-center ml-1">/ {availableSpace}</div>
                </div>
            }
        </div>
    );
};

export default ShelfBox;