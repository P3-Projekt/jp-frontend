"use client";
import React from "react";
import { fetchWithAuth } from "@/components/authentication/authentication";
import {
	useShelfContext,
	usePlacedAmountContext,
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

	const handlePlaceClick = () => {
		console.log("Place button clicked");
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

	return (
		<div>
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
						<div className="p-2 mb-2 bg-sidebarcolor shadow-md rounded-lg">
							<div className="text-black text-lg font-bold text-center">
								Autolokaliser
							</div>
						</div>

						{/* "Lokaliseret" background */}
						{placedAmount === amount ? (
							// If all plants are placed
							<div
								className="bg-colorprimary p-2 shadow-md rounded-lg cursor-pointer transition-all duration-300"
								onClick={handlePlaceClick}
							>
								<div className="text-white text-center text-lg font-bold">
									Bekræft placering
								</div>
							</div>
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
		</div>
	);
};

export default BatchReadyBox;
