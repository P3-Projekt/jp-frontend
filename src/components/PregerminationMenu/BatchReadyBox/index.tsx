"use client";
import React, { useState } from "react";
import { fetchWithAuth } from "@/components/authentication/authentication";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";

import {
	useShelfContext,
	usePlacedAmountContext,
	useAutolocateContext,
	useBatchPositionContext,
} from "@/app/pregermination/context";

interface BatchReadyProps {
	batchId: number;
	plantType: string;
	amount: number;
}

const BatchReadyBox: React.FC<BatchReadyProps> = ({
	batchId,
	plantType,
	amount,
}) => {
	const { setShelfMap, activeBatchId, setActiveBatchId } = useShelfContext();
	const { placedAmount, setBatchAmount, setPlacedAmount } =
		usePlacedAmountContext();
	const { setNestedMap: setAutolocateMap } = useAutolocateContext();
	const { batchPositionMap } = useBatchPositionContext();
	const [openDialog, setOpenDialog] = useState(false);

	const handleClick = async () => {
		if (activeBatchId === batchId) {
			updateShelfMap(new Object());
			setPlacedAmount(0);
			setActiveBatchId(null);
			setBatchAmount(null);
		} else {
			setPlacedAmount(0);
			setActiveBatchId(batchId);
			setBatchAmount(amount);
			await fetchMaxBatchesOnShelves(batchId);
		}
	};

	const fetchMaxBatchesOnShelves = async (batchId: number) => {
		try {
			const response = await fetchWithAuth(
				`http://localhost:8080/Batch/${batchId}/MaxAmountOnShelves`,
			);

			if (!response.ok) {
				throw new Error("Fetching max batches on shelves failed");
			}

			const result = await response.json();

			updateShelfMap(result);
		} catch (error) {
			alert(error);
		}
	};

	const fetchBatchPosition = async (data: unknown) => {
		try {
			const response = await fetchWithAuth(
				`http://localhost:8080/Batch/${batchId}/Position`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						locations: data,
						username: "demo",
					}),
				},
			);
			console.log("Response_________");
			console.log(JSON.stringify({ location: data, username: "demo" }));

			if (!response.ok) {
				throw new Error("Updating batch position failed");
			}
		} catch (error) {
			alert(error);
		}
	};

	const handleConfirmPlaceClick = async () => {
		setOpenDialog(false);
		console.log(batchPositionMap);
		const obj = mapToObject(batchPositionMap);
		console.log(obj);
		await fetchBatchPosition(obj);
	};

	// Function to convert a Map to a plain JavaScript object
	const mapToObject = (
		map: Map<string | number, unknown>,
	): Record<string, unknown> => {
		// Initialize an empty object to hold the converted Map data
		const obj: Record<string, unknown> = {};
		// Iterate over each key-value pair in the Map
		for (const [key, value] of map.entries()) {
			// Convert the key to a string (object keys in JSON must be strings)
			// If the value is another Map, call mapToObject recursively to handle it
			// Otherwise, directly assign the value to the object
			obj[String(key)] = value instanceof Map ? mapToObject(value) : value;
		}
		// Return the resulting plain object
		return obj;
	};

	const updateShelfMap = (data: object) => {
		const newShelfMap = new Map<number, number[]>(
			Object.entries(data).map(([key, value]) => [Number(key), value]),
		);
		setShelfMap({ shelves: newShelfMap });
	};

	const handlePlaceClick = () => {
		console.log("Place button clicked");

		setOpenDialog(true);
	};

	const handleAutolocateClick = async () => {
		console.log("Autolocate button clicked");

		try {
			const response = await fetchWithAuth(
				`http://localhost:8080/Batch/${batchId}/Autolocate`,
			);

			if (!response.ok) {
				throw new Error("Fetching autolocate on batches failed");
			}

			const result = await response.json();

			const autolocateMap = new Map();
			// for (const [key] of Object.entries(result)) {
			// 	const innerObject = result[key];
			// 	const outerKey = Number(key);

			// 	autolocateMap.set(outerKey, new Map());
			// 	for (const [innerKey, innerValue] of Object.entries(innerObject)) {
			// 		autolocateMap.get(outerKey).set(Number(innerKey), Number(innerValue));
			// 	}
			// }

			createNestedNumberMap(result, autolocateMap);

			setPlacedAmount(sumNestedNumberMap(autolocateMap));

			setAutolocateMap(autolocateMap);
		} catch (error) {
			if (error instanceof TypeError) {
				alert(
					"Failed to use autolocate as autolocateMap includes a non Map/Number value:" +
						error.message,
				);
			} else {
				alert(error);
			}
		}
	};

	// Create a nested number map from an object consisting of objects and numbers, and save result to outputMap
	const createNestedNumberMap = (
		sourceObject: object,
		outputMap: Map<number, unknown>,
	) => {
		for (const [key, value] of Object.entries(sourceObject)) {
			const numericKey = Number(key);
			const numericValue = Number(value);
			if (Number.isNaN(numericKey) || !Number.isInteger(numericKey)) {
				throw new TypeError(
					"Found key '" + key + "'which couldn't be parsed as an integer",
				);
			}
			if (value instanceof Object) {
				const nestedMap = new Map<number, unknown>();
				outputMap.set(numericKey, nestedMap);
				createNestedNumberMap(value, nestedMap);
			} else if (
				!Number.isNaN(numericValue) ||
				!Number.isInteger(numericValue)
			) {
				outputMap.set(numericKey, numericValue);
			} else {
				throw new TypeError(
					"Found value with type '" +
						typeof value +
						"', the object must consist only of objects and strings which can be parsed as an integer.",
				);
			}
		}
	};

	// Calculate the sum of a nested number map
	const sumNestedNumberMap = (nestedMap: Map<unknown, unknown>) => {
		let accumulator = 0;
		for (const value of nestedMap.values()) {
			if (value instanceof Map) {
				accumulator += sumNestedNumberMap(value);
			} else if (typeof value === "number") {
				accumulator += value;
			} else {
				throw new TypeError(
					"The nested map contains a type that is '" +
						typeof value +
						"' which is neither a number or a map",
				);
			}
		}

		return accumulator;
	};

	return (
		<>
			<div
				className={`p-2 mb-2 shadow-md rounded-lg ${activeBatchId === batchId ? "bg-colorprimary" : "bg-sidebarcolor"} cursor-pointer transition-all duration-300`}
				onClick={handleClick}
			>
				<p
					className={`text-center ${activeBatchId === batchId ? "text-white" : "text-black"} cursor-pointer transition-all duration-300`}
					onClick={handleClick}
				>
					{plantType}: {amount}
				</p>
			</div>
			<div>
				{/* Locate box*/}
				{activeBatchId === batchId && (
					// Outer background
					<div className="p-2 bg-darkgrey">
						{/* "Autolokaliser" background */}
						<div
							className="p-2 mb-2 bg-sidebarcolor shadow-md rounded-lg cursor-pointer"
							onClick={handleAutolocateClick}
						>
							<div className="text-black text-lg font-bold text-center">
								Autolokaliser
							</div>
						</div>

						{/* "Lokaliseret" background */}
						{placedAmount === amount ? (
							// If all plants are placed
							<>
								<div
									className="bg-colorprimary p-2 shadow-md rounded-lg cursor-pointer transition-all duration-300"
									onClick={handlePlaceClick}
								>
									<div className="text-white text-center text-lg font-bold">
										Placer batch
									</div>
								</div>

								<Dialog open={openDialog}>
									<DialogContent className="bg-white opacity-100 min-w-[600px] min-h-[300px] [&>button]:hidden">
										<DialogHeader>
											<div>{/* Header */}</div>
											<DialogTitle>
												<div className="flex flex-row justify-start items-center">
													<div className="text-black text-5xl uppercase font-bold cursor-default">
														Placer batch
													</div>
												</div>
											</DialogTitle>
											<DialogDescription>
												Er du sikker på at du vil bekræfte placeringen af denne
												batch? Dette valg er endeligt og kan ikke fortrydes.
											</DialogDescription>
											<DialogFooter>
												<div className="flex justify-between w-full">
													<Button
														className={
															`hover:cursor-pointer font-bold` +
															buttonVariants({
																variant: "cancel",
															})
														}
														onClick={() => {
															console.log("Cancel clicked");
															setOpenDialog(false);
														}}
													>
														Annuller placering
													</Button>
													<Button
														className={
															`hover:cursor-pointer font-bold` +
															buttonVariants({
																variant: "green",
															})
														}
														onClick={() => {
															console.log("Confirm clicked");
															handleConfirmPlaceClick();
														}}
													>
														Bekræft placering
													</Button>
												</div>
											</DialogFooter>
										</DialogHeader>
									</DialogContent>
								</Dialog>
							</>
						) : (
							// If not all plants are placed
							<div className="bg-sidebarcolor text-black p-2 shadow-md rounded-lg transition-all duration-300">
								<div className="text-black text-lg font-bold text-center">
									Lokaliseret: {placedAmount}/{amount}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default BatchReadyBox;
