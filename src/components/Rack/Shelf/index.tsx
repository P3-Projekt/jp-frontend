import {
	usePlacedAmountContext,
	useShelfContext,
} from "@/app/pregermination/context";
import React, { useEffect, useState } from "react";
import { ToastMessage } from "@/functions/ToastMessage/ToastMessage";

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
		const shelfArray = shelfMap.shelves.get(rack);
		if (shelfArray !== undefined) {
			const space = shelfArray.at(index);
			if (space) {
				setAvailableSpace(space);
			}
		} else {
			setAvailableSpace(0);
		}
	}, [shelfMap, rack, index]);

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

	const validateAndSetInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		let input: number = Number(event.target.value);
		const max: number = getMax(input);
		if (input < 0) {
			//Input may not be negative
			input = 0;
			ToastMessage({
				title: "Noget gik galt!",
				message: "Input må ikke være negativt",
				type: "error",
			});
		} else if (input > max) {
			//Input may not be more than max
			input = max;
			ToastMessage({
				title: "Noget gik galt!",
				message: "Input må ikke over maksimum",
				type: "error",
			});
		}

		const valueDifference: number = input - currentValue;
		const newPlacedAmount: number = placedAmount + valueDifference;
		setPlacedAmount(newPlacedAmount);
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
						onChange={(e): void => {
							validateAndSetInput(e);
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
