import {
	usePlacedAmountContext,
	useShelfContext,
	useAutolocateContext,
	useBatchPositionContext,
} from "@/app/pregermination/context";
import React, { useEffect, useState } from "react";
import { ToastMessage } from "@/functions/ToastMessage/ToastMessage";
import { ShelfData } from "@/app/pregermination/page";

const ShelfBox: React.FC<ShelfData> = ({ position, rackId, id: shelfId }) => {
	const { shelfMap } = useShelfContext(); //Get the shelfMap which tells this shelf how much available space it has
	const [currentValue, setCurrentValue] = useState(0); //The current input value which becomes the previous when the next input is entered
	const [availableSpace, setAvailableSpace] = useState(0); //The maximal space available on the shelf
	const { placedAmount, setPlacedAmount, batchAmount } =
		usePlacedAmountContext();
	const { nestedMap: autolocateMap } = useAutolocateContext();
	const { batchPositionMapSet, batchPositionMapDelete, batchPositionMapHas } =
		useBatchPositionContext();

	useEffect(() => {
		let autoLocateAmount = 0;
		const amount = autolocateMap.get(shelfId);
		if (amount) {
			autoLocateAmount = amount;
		}

		updateCurrentValue(autoLocateAmount);
	}, [autolocateMap, position, rackId, shelfId]);

	useEffect((): void => {
		setCurrentValue(0);
		if (shelfMap === undefined) {
			ToastMessage({
				title: "Noget gik galt!",
				message: "Hylderne er ikke defineret. Prøv at genindlæse siden.",
				type: "error",
			});
			throw new TypeError("shelfMap from useShelfContext is undefined");
		}
		const shelfArray = shelfMap.shelves.get(rackId);
		if (shelfArray !== undefined) {
			const space = shelfArray.at(position);
			if (space) {
				setAvailableSpace(space);
			}
		} else {
			setAvailableSpace(0);
		}
	}, [shelfMap, rackId, position]);

	const getMax = (currentlyPlaced: number): number => {
		if (batchAmount === null) {
			ToastMessage({
				title: "Uventet fejl",
				message: "Forventede en ikke-nul værdi for batch mængde",
				type: "error",
			});
			throw new TypeError(
				"Expected a non-null value for batchAmount, getMax should only be called when a batch is selected and then batchAmount should not be null",
			);
		}
		const valueDifference: number = currentlyPlaced - currentValue; // Get the difference from the new input and the previous input
		const leftToBePlaced: number =
			batchAmount - placedAmount + currentlyPlaced - valueDifference; // Calculate the amount left to be placed
		return leftToBePlaced < availableSpace ? leftToBePlaced : availableSpace; // Return the smaller of leftToBePlaced and availableSpace
	};

	// Update the current value and store the value in the batchPositionContext
	const updateCurrentValue = (value: number) => {
		setCurrentValue(value);

		if (value > 0) {
			console.log(
				`Shelf with id ${shelfId} and position ${position} settings its value to ${value}`,
			);
			console.log("Rack", rackId, "With shelf", shelfId, " Has ", value);
			batchPositionMapSet(shelfId, value);
		} else if (batchPositionMapHas(shelfId)) {
			console.log(
				`Shelf with id ${shelfId} and position ${position} deleting its value`,
			);
			batchPositionMapDelete(shelfId);
		}
	};

	const validateAndSetInput = (input: number) => {
		// Ensure we receive an actual number which is not less than 0
		if (Number.isNaN(input) || input < 0) {
			input = 0;
		} // If we did receive a number, ensure it is an integer
		else if (!Number.isInteger(input)) {
			input = Math.round(input);
		}

		// Ensure the number is not more than the maximum allowed.
		const max = getMax(input);
		if (input > max) {
			input = max;
			ToastMessage({
				title: "Noget gik galt!",
				message: "Input må ikke over maksimum",
				type: "error",
			});
		}

		// Calculate difference between input and current (previous value)
		const valueDifference = input - currentValue;

		// Calculate the total placed amount across all input fields
		const newPlacedAmount = placedAmount + valueDifference;

		//Update total placed amount and the current value
		setPlacedAmount(newPlacedAmount);
		updateCurrentValue(input);
	};

	return (
		// Shelf container
		<div
			className="flex-1 flex items-center justify-center rounded-lg bg-zinc-200"
			onClick={() => console.log(rackId, shelfId)}
		>
			{availableSpace >= 0 && (
				<div className="flex items-center">
					<input
						type="number"
						min={0}
						value={currentValue}
						onChange={(e) => {
							validateAndSetInput(e.target.valueAsNumber);
						}}
						className="w-12 h-4 bg-sidebarcolor rounded border border-colorprimary text-black text-center text-sm"
					/>
					<div className="text-black text-center ml-1 text-sm ">
						/ {availableSpace}
					</div>
				</div>
			)}
		</div>
	);
};

export default ShelfBox;
