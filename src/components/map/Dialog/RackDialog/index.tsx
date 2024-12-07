"use client";
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/components/authentication/authentication";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button, buttonVariants } from "@/components/ui/button";
import { RackData } from "@/components/map/Rack";
import { Droplets, Loader2, Scissors, X } from "lucide-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { BatchData } from "../../Batch";
import { getUser } from "@/components/authentication/authentication";

import { ToastMessage } from "@/functions/ToastMessage/ToastMessage";

let rackToDisplayUnSynced: RackData | null = null;

export function setRackToBeDisplayed(rack: RackData): void {
	rackToDisplayUnSynced = rack;
}

interface RackDialogProps {
	showDialog: boolean;
	setShowDialog: (show: boolean) => void;
	getLocations: (batchId: number) => string[];
}

const RackDialog: React.FC<RackDialogProps> = ({
	showDialog,
	setShowDialog,
	getLocations,
}) => {
	const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null);
	const [taskCompleting, setTaskCompleting] = useState<boolean>(false);
	const [completeConfirm, setCompleteConfirm] = useState<boolean>(false);

	const taskTranslate: { [key: string]: string } = {
		Water: "Vanding",
		Harvest: "Høst",
		Plant: "Plantning",
	};
	const nextTaskTranslated = selectedBatch?.nextTask.category
		? taskTranslate[selectedBatch.nextTask.category]
		: null;

	// Set selectedBatch to null if the showDialog changes to false
	useEffect(() => {
		if (showDialog) {
			setSelectedBatch(null);
		}
	}, [showDialog]);

	const rackToDisplay = rackToDisplayUnSynced;

	const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

	function taskIsDue(batch: BatchData): boolean {
		return new Date(currentDate) >= new Date(batch.nextTask.dueDate);
	}

	//Avoid mouse event bubbling down to elements below
	const propagateMouseEvent = function (e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation();
	};

	return (
		<div onMouseDown={propagateMouseEvent}>
			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent className="bg-white opacity-100 min-w-[900px] min-h-[500px] [&>button]:hidden">
					<DialogHeader>
						<DialogTitle>
							<div className="flex flex-row justify-start items-center">
								<div className="text-black text-5xl uppercase font-bold cursor-defaul">
									Reol {rackToDisplay?.id}
								</div>
								<div className="ml-auto -mr-3">
									<X
										className="size-14 text-black cursor-pointer"
										aria-label={"Luk reol vindue"}
										onClick={() => {
											setShowDialog(false);
										}}
									/>
								</div>
							</div>
						</DialogTitle>
						<DialogDescription>
							<div className="min-h-full gap-x-5 flex flex-row justify-between content-center">
								{/* rack information */}
								<div className="h-[320px] self-center items-start basis-2/5 flex flex-col bg-blue-200 text-xl text-black rounded border-2 border-black pl-2 pr-2">
									<div>
										Næste opgave:{" "}
										<span className="font-semibold font-">
											{nextTaskTranslated}
										</span>
									</div>
									<div>
										Plante:{" "}
										<span className="font-semibold">
											{selectedBatch?.plant}
										</span>
									</div>
									<div>
										Antal:{" "}
										<span className="font-semibold">
											{selectedBatch?.amount}
										</span>
									</div>
									<div>
										Bakke:{" "}
										<span className="font-semibold">{selectedBatch?.tray}</span>
									</div>
									<div>
										Batch id:{" "}
										<span className="font-semibold">{selectedBatch?.id}</span>
									</div>
									<div>
										Lokationer:{" "}
										<span className="font-semibold">
											{selectedBatch != null &&
												getLocations(selectedBatch.id).join(", ")}
										</span>
									</div>
									<div className="mt-3">
										Oprettet af:{" "}
										<span className="font-semibold">
											{selectedBatch?.createdBy}
										</span>
									</div>
									<div className="">
										Høstdato:{" "}
										<span className="font-semibold text-lg">
											{selectedBatch?.harvestDate}
										</span>
									</div>
									<div
										className={`mt-4 self-center uppercase font-bold ${selectedBatch !== null && taskIsDue(selectedBatch) ? "" : "hidden"}`}
									>
										<Button
											disabled={taskCompleting}
											aria-label={"Udfør opgave"}
											className={
												`hover:cursor-pointer font-bold` +
												buttonVariants({
													variant: "green",
												})
											}
											onClick={() => {
												setCompleteConfirm(true);
											}}
										>
											{!taskCompleting ? (
												"Udfør opgave"
											) : (
												<Loader2 className="animate-spin" />
											)}
										</Button>
									</div>
								</div>
								{/* Batch information */}
								<div
									className={`h-[400px] pl-2 basis-3/5 grid grid-cols-1 grid-rows-7 gap-y-5 justify-evenly content-center`}
								>
									{/* Skal oprettes dynamisk alt efter hvor mange hylder der er */}
									{rackToDisplay?.shelves.map((shelf, index) => (
										<div
											key={index}
											className="w-full h-full flex flex-col content-center justify-evenly"
										>
											<div className="flex flex-row h-full">
												<div className="text-xl text-black font-bold self-center">
													{index + 1}
												</div>
												<div className="h-full w-full overflow-x-scroll ml-2 bg-gray-200 justify-between content-center pl-2 pr-2 self-center border-black border-2">
													<div className="h-4/5 w-full flex flex-row items-center gap-x-1">
														{/* Dynamiclly adding batches */}
														{shelf.batches.map((batch: BatchData) => (
															<div
																key={batch.id}
																className={`flex flex-row h-full content-center items-center self-center pl-1 pr-1 text-black border-black border rounded  font-semibold hover:cursor-pointer ${selectedBatch === batch ? "bg-blue-200" : ""}`}
																onClick={(): void => {
																	// Her vælges den specifikke batch:
																	if (selectedBatch === batch) {
																		setSelectedBatch(null);
																	} else {
																		setSelectedBatch(batch);
																	}
																}}
															>
																<p className="text-xl">{batch.plant}</p>
																{batch?.nextTask.category === "Water" &&
																taskIsDue(batch) ? (
																	<Droplets
																		className={`text-blue-600 border-black size-5 self-center`}
																	/>
																) : batch?.nextTask.category === "Harvest" &&
																  taskIsDue(batch) ? (
																	<Scissors
																		className={`text-green-600 size-5`}
																	/>
																) : batch.nextTask.progress >= 0 ||
																  batch.nextTask.progress != null ? (
																	<CircularProgressbar
																		value={batch.nextTask.progress}
																		className={`size-4 w-fit ml-1`}
																		strokeWidth={25}
																		minValue={0}
																		maxValue={100}
																	/>
																) : null}
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<AlertDialog open={completeConfirm}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Vil du udføre denne opgave?</AlertDialogTitle>
						<AlertDialogDescription>
							Det anbefales at du fysisk har udført upgaven inden dette
							bekræftes.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							aria-label={"Annuller udførelse"}
							className={buttonVariants({ variant: "cancel" })}
							onClick={(): void => {
								// Cancel completion
								setCompleteConfirm(false);
							}}
						>
							Annuller
						</Button>
						<Button
							aria-label={"Bekræft udførelse"}
							disabled={taskCompleting}
							className={buttonVariants({ variant: "green" })}
							onClick={(): void => {
								setTaskCompleting(true);
								// Udfør opgaven
								try {
									fetchWithAuth(
										`http://localhost:8080/Task/${selectedBatch?.nextTask.id}/Complete`,
										{
											method: "PUT",
											headers: {
												"Content-Type": "application/json",
											},
											body: JSON.stringify({ username: getUser() }),
										},
									)
										.then((response: Response): void => {
											// Check if the response is ok
											if (!response.ok) {
												ToastMessage({
													title: "Uventet fejl!",
													message:
														"Vi stødte på et problem, vent og prøv igen.",
													type: "error",
												});
												throw new Error("Network response was not ok");
											} else {
												ToastMessage({
													title: "Opgave udført",
													message: "Opgaven er blevet udført",
													type: "success",
												});
												window.location.reload();
											}
										})
										// Error handling
										.catch((err): void => {
											ToastMessage({
												title: "Noget gik galt!",
												message: "Opgaven kunne ikke udføres, prøv igen.",
												type: "error",
											});
											console.error("Error deleting shelf: " + err);
											setTaskCompleting(false);
											setCompleteConfirm(false);
										});
								} catch (err) {
									ToastMessage({
										title: "Noget gik galt!",
										message: "Opgaven kunne ikke udføres, prøv igen.",
										type: "error",
									});
									console.error("Fejl under udføring af opgave: " + err);
									setTaskCompleting(false);
									setCompleteConfirm(false);
								}
								setTaskCompleting(false);
								setCompleteConfirm(false);
								setShowDialog(false);
							}}
						>
							{!taskCompleting ? (
								"Bekræft"
							) : (
								<Loader2 className="animate-spin" />
							)}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default RackDialog;
