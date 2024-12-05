import {
	usePlacedAmountContext,
	useShelfContext,
	useAutolocateContext,
} from "@/app/pregermination/context";
import React, { useEffect, useState } from "react";

export interface ShelfProps {
	index: number;
	rack: number;
}

const ShelfBox: React.FC<ShelfProps> = ({ index, rack }) => {
	const { shelfMap } = useShelfContext(); //Get the shelfMap which tells this shelf how much available space it has
	const [currentValue, setCurrentValue] = useState(0); //The current input value which becomes the previous when the next input is entered
	const [availableSpace, setAvailableSpace] = useState(0); //The maximal space available on the shelf
	const { placedAmount, setPlacedAmount, batchAmount } =
		usePlacedAmountContext();
	const { autolocateMap } = useAutolocateContext();

	//console.log(`Rendering shelf ${index} on rack ${rack}`);

	useEffect(() => {
		let autoLocateAmount = 0;
		const rackMap = autolocateMap.get(rack);
		if (rackMap !== undefined) {
			const amount = rackMap.get(index + 1);
			autoLocateAmount = typeof amount === "number" ? amount : 0;
		}

		if (autoLocateAmount !== 0) {
		}
		setCurrentValue(autoLocateAmount);
	}, [autolocateMap, index, rack]);

	useEffect(() => {
		setCurrentValue(0);
		if (shelfMap === undefined) {
			throw new TypeError("shelfMap from useShelfContext is undefined");
		}
		const shelfArray = shelfMap.shelves.get(rack);
		if (shelfArray !== undefined) {
			const space = shelfArray.at(index);
			if (space) {
				setAvailableSpace(space);
			}
		} else {
			//console.log("Setting space to 0");
			setAvailableSpace(0);
		}
	}, [shelfMap, rack, index]);

	const getMax = (currentlyPlaced: number) => {
		if (batchAmount === null) {
			throw new TypeError(
				"Expected a non-null value for batchAmount, getMax should only be called when a batch is selected and then batchAmount should not be null",
			);
		}

		//console.log(`batchAmount: ${batchAmount}, placedAmount: ${placedAmount}, ${currentlyPlaced}`);
		const valueDifference = currentlyPlaced - currentValue; // Get the difference from the new input and the previous input
		const leftToBePlaced =
			batchAmount - placedAmount + currentlyPlaced - valueDifference; // Calculate the amount left to be placed
		//console.log(`leftToBePlaced: ${leftToBePlaced}`);
		return leftToBePlaced < availableSpace ? leftToBePlaced : availableSpace; // Return the smaller of leftToBePlaced and availableSpace
	};

	const validateAndSetInput = (input: number) => {
		const max = getMax(input);
		if (input < 0) {
			//Input may not be negative
			input = 0;
		} else if (input > max) {
			//Input may not be more than max
			input = max;
		}

		//console.log("Set input to: " + input + ", max is: " + max);
		//event.target.value = input.toString();
		const valueDifference = input - currentValue;
		const newPlacedAmount = placedAmount + valueDifference;
		setPlacedAmount(newPlacedAmount);
		//console.log("Placed amount was before: " + placedAmount + " and is now: " + newPlacedAmount);
		setCurrentValue(input);
	};

	return (
		// Shelf container
		<div className="flex-1 flex items-center justify-center rounded-lg bg-zinc-200">
			{availableSpace > 0 && (
				<div className="flex items-center">
					<input
						type="number"
						min={0}
						value={currentValue}
						onChange={(e) => {
							validateAndSetInput(e.target.valueAsNumber);
						}}
						className="w-12 h-5 bg-sidebarcolor rounded border border-colorprimary text-black text-center"
					/>
					<div className="text-black text-center ml-1">/ {availableSpace}</div>
				</div>
			)}
		</div>
	);
};

export default ShelfBox;
