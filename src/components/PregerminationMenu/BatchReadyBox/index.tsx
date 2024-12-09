"use client";
import React, { useState } from "react";
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
	usePregerminationContext,
	getPlacedAmount,
} from "@/app/pregermination/context";
import {
	fetchWithAuth,
	getUser,
} from "@/components/authentication/authentication";
import { ToastMessage } from "@/functions/ToastMessage/ToastMessage";
import { endpoint } from "@/config/config";

interface BatchReadyProps {
	batchId: number;
	plantType: string;
	amount: number;
	onPlace: () => void;
}

const BatchReadyBox: React.FC<BatchReadyProps> = ({
	batchId,
	plantType,
	amount,
	onPlace,
}) => {
	const {
		activeBatchId,
		setActiveBatchId,
		setAvailableSpace,
		setBatchAmount,
		setBatchPosition,
		batchPosition,
	} = usePregerminationContext();

	const [openDialog, setOpenDialog] = useState(false);

	const handleClick = async () => {
		if (activeBatchId === batchId) {
			setActiveBatchId(null);
			setBatchAmount(null);
		} else {
			setActiveBatchId(batchId);
			setBatchAmount(amount);
			await fetchMaxBatchesOnShelves(batchId);
		}
		setBatchPosition({});
	};

	const fetchMaxBatchesOnShelves = async (batchId: number) => {
		try {
			const response = await fetchWithAuth(
				`${endpoint}/Batch/${batchId}/MaxAmountOnShelves`,
			);

			if (!response.ok) {
				const errorMesssage = await response.text();
				throw new Error(
					"Fetching max amount on shelves failed: " + errorMesssage,
				);
			}

			const result = await response.json();

			setAvailableSpace(result);
		} catch (err) {
			ToastMessage({
				title: "Uventet fejl",
				message: "Kunne ikke hente maksimal mængde på hylder",
				type: "error",
			});
			console.error("Kunne ikke hente maksimal mængde på hylder: " + err);
		}
	};

	const handleConfirmPlaceClick = async () => {
		setOpenDialog(false);
		try {
			console.log(getUser());
			const response = await fetchWithAuth(
				`${endpoint}/Batch/${batchId}/Position`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						locations: batchPosition,
						username: getUser(),
					}),
				},
			);

			if (!response.ok) {
				const errorMesssage = await response.text();
				throw new Error("Placing batch failed: " + errorMesssage);
			}

			onPlace();
			setActiveBatchId(null);
			setBatchAmount(null);
			setBatchPosition({});
		} catch (err) {
			ToastMessage({
				title: "Uventet fejl",
				message: "Kunne ikke placere batch",
				type: "error",
			});
			console.error("Kunne ikke placere batch: " + err);
		}
	};

	const handlePlaceClick = () => {
		setOpenDialog(true);
	};

	const handleAutolocateClick = async () => {
		try {
			const response = await fetchWithAuth(
				`${endpoint}/Batch/${batchId}/Autolocate`,
			);

			if (!response.ok) {
				throw new Error("Fetching autolocate on batches failed");
			}

			const result = await response.json();

			setBatchPosition(result);
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
						{getPlacedAmount(batchPosition) === amount ? (
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
									Lokaliseret: {getPlacedAmount(batchPosition)}/{amount}
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
