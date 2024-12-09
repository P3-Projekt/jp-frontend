"use client";
import React, { useEffect, useState } from "react";
import GerminationBox from "@/components/PregerminationMenu/GerminationBox/index";
import BatchReadyBox from "@/components/PregerminationMenu/BatchReadyBox/index";
import { PregerminationProvider } from "./context";
import { fetchWithAuth } from "@/components/authentication/authentication";
import CanvasComponent, { DisplayMode } from "@/components/map/CanvasComponent";
import { endpoint } from "@/config/config";

interface Batch {
	batchId: number;
	amount: number;
	plantName: string;
	dueDate: string;
	daysUntilReady: number;
}

export interface ShelfData {
	id: number;
	rackId: number;
	position: number;
}

interface Vector2 {
	x: number;
	y: number;
}

export interface RackData {
	id: number;
	position: Vector2;
	shelves: ShelfData[];
}

const PreGerminationPage: React.FC = () => {
	const [pregerminatingBatches, setPregerminatingBatches] = useState<Batch[]>(
		[],
	); // Store batches still pregerminating in this
	const [canBePlacedBatches, setCanBePlacedBatches] = useState<Batch[]>([]); // Store batches ready to be placed in this

	useEffect(() => {
		const fetchBatchData = async () => {
			try {
				const response = await fetchWithAuth(
					endpoint + "/PreGerminatingBatches",
				); // Fetch pregerminating batches

				if (!response.ok) {
					throw new Error("Fetching batch data failed");
				}

				const result = await response.json();

				const today = new Date(); // Get todays date
				const getDaysUntilReady = (dueDate: string) => {
					const dueDateObj = new Date(dueDate); // Create date object from the dueDate from the Batch object
					let diffDays = dueDateObj.getTime() - today.getTime(); // Get the difference in milliseconds
					diffDays = Math.ceil(diffDays / 86400000); // Difference in milliseconds -> difference in days

					return diffDays;
				};

				// Create array for the batches still pregerminating and calculate daysUntilReady from dueDate
				const preGerminationBatches = result.needsMorePreGermination.map(
					(item: Batch) => ({
						...item,
						daysUntilReady: getDaysUntilReady(item.dueDate),
					}),
				);

				// Create array for the batches still canBePlacedBatches and calculate daysUntilReady from dueDate
				const canBePlacedBatches = result.canBePlaced.map((item: Batch) => ({
					...item,
					daysUntilReady: getDaysUntilReady(item.dueDate),
				}));

				setPregerminatingBatches(preGerminationBatches);
				setCanBePlacedBatches(canBePlacedBatches);
			} catch (error) {
				alert(error);
			}
		};

		fetchBatchData();
	}, []);

	const handleRemovePlacedBatch = (batchId: number) => {
		// Remove batch from canBePlacedBatches
		const newCanBePlacedBatches = canBePlacedBatches.filter(
			(batch: Batch) => batch.batchId !== batchId,
		);
		setCanBePlacedBatches(newCanBePlacedBatches);
	};

	return (
		<PregerminationProvider>
			<div className="flex h-full">
				{/* Grey "Forspiring" background */}
				<div className="w-[250px] fixed h-full bg-lightgrey flex flex-col">
					<div className="bg-colorprimary mb-2">
						<h1 className="text-white font-bold text-2xl text-center mt-2 mb-2">
							Forspiring
						</h1>
					</div>

					{/* Centered "Klar" box with border */}
					<div className="flex justify-center items-center">
						<div className="bg-sidebarcolor w-full p-2 text-center text-colorprimary font-bold text-xl border-b-4 border-t-4 border-colorprimary">
							Klar
						</div>
					</div>

					{/* "Klar" box content */}
					<div className="bg-lightgrey p-2 space-y-2 flex-1 overflow-y-auto">
						{canBePlacedBatches.map((batch: Batch, index: number) => (
							<BatchReadyBox
								batchId={batch.batchId}
								plantType={batch.plantName}
								amount={batch.amount}
								key={index}
								onPlace={() => handleRemovePlacedBatch(batch.batchId)}
							/>
						))}
					</div>

					{/* Centered "Spirer" box with border */}
					<div className="flex justify-center items-center">
						<div className="bg-sidebarcolor w-full p-2 text-center text-colorprimary font-bold text-xl border-b-4 border-t-4 border-colorprimary">
							Spirer
						</div>
					</div>

					{/* "Spire" box content */}
					<div className="bg-lightgrey p-2 mb-2 flex-1 overflow-y-auto">
						{pregerminatingBatches.map((batch: Batch, index: number) => (
							<GerminationBox
								plantType={batch.plantName}
								amount={batch.amount}
								daysUntilReady={batch.daysUntilReady}
								key={index}
							/>
						))}
					</div>
				</div>

				{/* Display racks */}
				<div className="ml-[250px] flex-1">
					<CanvasComponent displayMode={DisplayMode.input} />
				</div>
			</div>
		</PregerminationProvider>
	);
};

export default PreGerminationPage;
