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
import { X } from "lucide-react";

import {
	useShelfContext,
	usePlacedAmountContext,
	useAutolocateContext,
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
	const { setAutolocateMap } = useAutolocateContext();
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
			for (const [key] of Object.entries(result)) {
				const innerObject = result[key];
				const outerKey = Number(key);

				autolocateMap.set(outerKey, new Map());
				for (const [innerKey, innerValue] of Object.entries(innerObject)) {
					autolocateMap.get(outerKey).set(Number(innerKey), Number(innerValue));
				}
			}

			setPlacedAmount(sumNestedNumberMap(autolocateMap));

			setAutolocateMap(autolocateMap);
		} catch (error) {
			if (error instanceof TypeError) {
				alert(
					"Failed to use autolocate as autolocateMap includes a non Map/Number value",
				);
			} else {
				alert(error);
			}
		}
	};

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
										Bekræft placering
									</div>
								</div>

								<Dialog open={openDialog}>
									<DialogContent className="bg-white opacity-100 min-w-[500px] min-h-[300px] [&>button]:hidden">
										<DialogHeader>
											<DialogTitle>
												<div>
													<div className="ml-auto -mr-3">
														<X
															className="size-14 text-black cursor-pointer"
															onClick={() => {
																setOpenDialog(false);
															}}
														/>
													</div>
												</div>
											</DialogTitle>
											<DialogDescription></DialogDescription>
											<DialogFooter></DialogFooter>
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
