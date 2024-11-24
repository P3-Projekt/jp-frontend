import useShelfContext from "@/app/pregermination/context";
import React, { useEffect, useState } from "react";

export interface ShelfProps {
    index: number;
    rack: number;
}

const ShelfBox: React.FC<ShelfProps> = ({index, rack}) => {
    const { shelfMap } = useShelfContext();

    const [availableSpace, setAvailableSpace] = useState<number>(0);

    useEffect(() => {
        if (shelfMap !== undefined) {
            const shelfArray = shelfMap.shelves.get(rack);
            if (shelfArray !== undefined) {
                const space = shelfArray.at(index);
                if (space) {
                    setAvailableSpace(space);
                }
            } else {
                console.log("Setting space to 0");
                setAvailableSpace(0);
            }
        }
    }, [shelfMap, rack, index]);

    return (
        // Shelf container
        <div className="flex-1 flex items-center justify-center rounded-lg bg-[#a5a4a2]">
            {availableSpace > 0 &&
                <div className="flex items-center">
                    <div className="w-6 h-4 bg-[#f3f2f0] rounded border border-[#2b4e42]"/>
                    <div className="text-black text-center ml-1">/ {availableSpace}</div>
                </div>
            }
        </div>
    );
};

export default ShelfBox;