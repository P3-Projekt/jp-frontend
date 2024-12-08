import React, { createContext, ReactNode, useContext, useState } from "react";

interface PregerminationContext {
	/**
	 * The ID of the batch that the user has currently selected
	 */
	activeBatchId: number | null;
	/**
	 * Update the currently selected batch ID
	 * @param batchId The ID of the newly selected batch, or null if the batch was deselected
	 */
	setActiveBatchId: (batchId: number | null) => void;
	/**
	 * The total amount of 'fields' in the currently selected batch, or null if no batch is currently selected.
	 */
	batchAmount: number | null;
	/**
	 * Update the total amount of fields in the currently selected batch
	 * @param amount The amount of the newly selected batch, or null if the batch was deselected
	 */
	setBatchAmount: (amount: number | null) => void;
	/**
	 * An object where each key corresponds to a rack ID and each entry in the corresponding array describes the max available space for a given shelf, given the selected batch
	 */
	availableSpace: { [rackId: number]: number[] };
	/**
	 * Update the available space object
	 * @param newAvailableSpaceMap The new object
	 */
	setAvailableSpace: (newAvailableSpaceMap: {
		[key: number]: number[];
	}) => void;
	/**
	 * An object where each key corresponds to a shelf ID and the corresponding value describes the amount which is currently entered in the corresponding shelfInput
	 */
	batchPosition: { [key: number]: number };

	/**
	 * Set the batch position object to a new object
	 * @param newBatchPositionMap The new object with key-value pairs
	 */
	setBatchPosition: (newBatchPositionMap: { [key: number]: number }) => void;

	/**
	 * Update an entry in the batch position object with a new (key, value) pair
	 * @param key The key to be updated
	 * @param value The value which should be saved at the key
	 */
	batchPositionSet: (key: number, value: number) => void;

	/**
	 * Delete an entry in the batch position object
	 * @param key The key to be deleted
	 */
	batchPositionDelete: (key: number) => void;

	/**
	 * Check if the batch position object contains a specific key
	 * @param key The key to check
	 * @returns True if the key exists, false otherwise
	 */
	batchPositionExists: (key: number) => boolean;
}

const PregerminationContext = createContext<PregerminationContext | undefined>(
	undefined,
);

/**
 * PregerminationProvider component that provides context values for pregermination process.
 *
 * @param children - The child components that will have access to the context values.
 *
 * @returns The PregerminationContext.Provider component with the provided context values.
 *
 * @context
 * - activeBatchId: The ID of the currently active batch.
 * - setActiveBatchId: Function to set the active batch ID.
 * - batchAmount: The amount of batches.
 * - setBatchAmount: Function to set the batch amount.
 * - availableSpace: An object representing available space with keys as numbers and values as arrays of numbers.
 * - setAvailableSpace: Function to set the available space.
 * - batchPosition: An object representing batch positions with keys as numbers and values as numbers.
 * - setBatchPosition: Function to set the batch position.
 * - batchPositionSet: Function to set a specific batch position.
 * - batchPositionDelete: Function to delete a specific batch position.
 * - batchPositionExists: Function to check if a specific batch position exists.
 */
export const PregerminationProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [availableSpace, setAvailableSpace] = useState<{
		[key: number]: number[];
	}>({});
	const [activeBatchId, setActiveBatchId] = useState<number | null>(null);
	const [batchAmount, setBatchAmount] = useState<number | null>(null);
	const [batchPosition, setBatchPosition] = useState<{ [key: number]: number }>(
		{},
	);

	/**
	 * Deletes a key from the batchPosition object
	 * @param key The key to be deleted
	 * @param value
	 */
	const batchPositionSet = (key: number, value: number) => {
		setBatchPosition((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const batchPositionDelete = (key: number) => {
		setBatchPosition((prev) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [key]: _, ...newMap } = prev;
			return newMap;
		});
	};

	const batchPositionExists = (key: number) => {
		return key in batchPosition;
	};

	return (
		<PregerminationContext.Provider
			value={{
				activeBatchId,
				setActiveBatchId,
				batchAmount,
				setBatchAmount,
				availableSpace,
				setAvailableSpace,
				batchPosition,
				setBatchPosition,
				batchPositionSet,
				batchPositionDelete,
				batchPositionExists,
			}}
		>
			{children}
		</PregerminationContext.Provider>
	);
};

export function usePregerminationContext() {
	const pregerminationContext = useContext(PregerminationContext);

	if (pregerminationContext === undefined) {
		throw new Error(
			"usePregerminationContext must be used within a PregerminationContextProvider",
		);
	}
	return pregerminationContext;
}

export function getPlacedAmount(batchPositionMap: {
	[key: number]: number;
}): number {
	let total = 0;
	for (const value of Object.values(batchPositionMap)) {
		total += value;
	}
	return total;
}
