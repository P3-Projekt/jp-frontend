import React from "react";

interface ShelfProps {
    availableSpace: number;
}

const ShelfBox: React.FC<ShelfProps> = ({availableSpace}) => {
    return (
        // Shelf container
        <div className="flex-1 flex items-center justify-center rounded-lg bg-[#a5a4a2]">
            <div className="w-6 h-4 bg-[#f3f2f0] rounded border border-[#2b4e42]" />
            <div className="text-black text-center">/{availableSpace}</div>
        </div>
    );
};

export default ShelfBox;