import { usePlacedAmountContext, useShelfContext } from "@/app/pregermination/context";
import React, { useEffect, useState } from "react";

export interface ShelfProps {
    index: number;
    rack: number;
}

const ShelfBox: React.FC<ShelfProps> = ({index, rack}) => {
    const { shelfMap } = useShelfContext();
    const [previousValue, setPreviousValue] = useState(0);
    const [availableSpace, setAvailableSpace] = useState(0);
    const { placedAmount, setPlacedAmount, batchAmount } = usePlacedAmountContext();

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

    const getMax = (currentlyPlaced: number) => {
        if (batchAmount !== null) {
            console.log("Batch amount: " + batchAmount);
            console.log("Currently placed: " + currentlyPlaced);
            console.log("placedAmount: " + placedAmount);
            const leftToBePlaced = batchAmount - placedAmount - 1;
            return leftToBePlaced + currentlyPlaced < availableSpace ? leftToBePlaced + currentlyPlaced : availableSpace;
        }
        return availableSpace;
    }

    const validateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
         let input = Number(event.target.value);
        // const max = getMax(input);
        // if (input > max) {
        //     input = max;
        // }
        // event.target.value = input.toString();

        console.log("Previous value: " + previousValue + ", placedAmount total: " + placedAmount);
        const valueDifference = input - previousValue;
        setPlacedAmount(placedAmount + valueDifference);
        setPreviousValue(input);
    }

    return (
        // Shelf container
        <div className="flex-1 flex items-center justify-center rounded-lg bg-[#d9d9d9]">
            {availableSpace > 0 &&
                <div className="flex items-center">
                    <input
                        type="number"
                        min={0}
                        onChange={(e) => {
                            validateInput(e);
                        }}
                        className="w-12 h-5 bg-[#f3f2f0] rounded border border-[#2b4e42] text-black text-center"
                    />
                    <div className="text-black text-center ml-1">/ {availableSpace}</div>
                </div>
            }
        </div>
    );
};

export default ShelfBox;