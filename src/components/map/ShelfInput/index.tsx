import {
	usePregerminationContext,
	getPlacedAmount,
} from "@/app/pregermination/context";
import { ToastMessage } from "@/functions/ToastMessage/ToastMessage";

interface ShelfData {
	rackId: number;
	shelfId: number;
	position: number;
}

const ShelfBox: React.FC<ShelfData> = ({ position, rackId, shelfId }) => {
	const {
		availableSpace,
		activeBatchId,
		batchAmount,
		batchPosition,
		batchPositionSet,
		batchPositionDelete,
		batchPositionExists,
	} = usePregerminationContext();

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
		// Get the difference from the new input and the previous input
		const valueDifference: number =
			currentlyPlaced - batchPosition[shelfId] || 0;
		// Calculate the amount left to be placed
		const leftToBePlaced: number =
			batchAmount -
			getPlacedAmount(batchPosition) +
			currentlyPlaced -
			valueDifference;
		// Return the smaller of leftToBePlaced and availableSpace
		const availableSpaceAtPosition = availableSpace[rackId]?.at(position) ?? 0;
		return leftToBePlaced < availableSpaceAtPosition
			? leftToBePlaced
			: availableSpaceAtPosition;
	};

	// Update the current value and store the value in the batchPositionContext
	const updateCurrentValue = (value: number) => {
		if (value > 0) {
			batchPositionSet(shelfId, value);
		} else if (batchPositionExists(shelfId)) {
			batchPositionDelete(shelfId);
		}
	};

	const validateAndSetInput = (input: number) => {
		// Ensure we receive an actual number which is not less than 0
		if (Number.isNaN(input) || input < 0) {
			input = 0;
		} // If we did receive a number, ensure it is an integer
		else if (!Number.isInteger(input)) {
			console.log("Input was not an integer, rounding to nearest integer");
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

		// Update total placed amount and the current value
		updateCurrentValue(input);
	};

	return (
		// Shelf container
		<div className="flex-1 flex items-center justify-center rounded-lg bg-zinc-200">
			{activeBatchId !== null && (
				<div className="flex items-center">
					<input
						type="number"
						min={0}
						value={batchPosition[shelfId] || 0}
						onChange={(e) => {
							const newValue = e.target.valueAsNumber; // This is NaN if the field is empty
							//validateAndSetInput(Number.isNaN(newValue) ? 0 : newValue);
							validateAndSetInput(newValue);
						}}
						className="w-12 h-4 bg-sidebarcolor rounded border border-colorprimary text-black text-center text-sm"
					/>
					<div className="text-black text-center ml-1 text-sm ">
						/ {availableSpace[rackId]?.at(position) || 0}
					</div>
				</div>
			)}
		</div>
	);
};

export default ShelfBox;
