"use client";
import React, { useState } from "react";
import RackDialog, { setRackToBeDisplayed } from "../Dialog/RackDialog";
import ShelfBox from "@/components/Rack/Shelf";

import { DisplayMode } from "@/components/map/CanvasComponent";

import { ShelfData, Shelf } from "@/components/map/Shelf";

import { ToastMessage } from "@/functions/ToastMessage/ToastMessage";

import { Plus, Minus, Trash2 } from "lucide-react";

//Constants
export const rackWidth: number = 100;
export const rackHeight: number = 200;

export interface RackData {
	id: number;
	position: { x: number; y: number };
	shelves: ShelfData[];
}

// DraggableBox component props
interface DraggableBoxProps {
	rackData: RackData;
	isSelected: boolean | undefined;
	mouseDownHandler: ((e: React.MouseEvent<HTMLDivElement>) => void) | undefined;
	displayMode: DisplayMode;
	isLoading: boolean;
}

const DraggableBox: React.FC<DraggableBoxProps> = ({
	rackData,
	isSelected,
	mouseDownHandler,
	displayMode,
	isLoading,
}) => {
	// State for position and dragging
	const [showDialog, setShowDialog] = useState<boolean>(false);
	const [rackShelves, setRackShelves] = useState<ShelfData[]>(rackData.shelves);

	const mouseDownHandlerWrapper = function (
		e: React.MouseEvent<HTMLDivElement>,
	): void {
		if (displayMode === DisplayMode.view) {
			setRackToBeDisplayed(rackData);
			setShowDialog(true);
		}
		if (mouseDownHandler) {
			mouseDownHandler(e);
		}
	};

	return (
		// Rack container
		<>
			<div
				className={
					"absolute flex flex-col bg-colorprimary rounded-lg p-1 outline outline-green-800 outline-1 outline-offset-0" +
					(isSelected
						? "cursor-grabbing scale-105 border-black"
						: "cursor-grab")
				}
				onMouseDown={mouseDownHandlerWrapper}
				style={{
					left: rackData.position.x, // Adjust for pan offset visually only
					top: rackData.position.y, // Adjust for pan offset visually only
					width: rackWidth,
					height: rackHeight,
					border: isSelected ? "2px solid black" : "none",
				}}
			>
				<div className="bg-colorprimary rounded-lg mb-1">
					{/* Show rack ID */}
					{displayMode === DisplayMode.input ||
					displayMode == DisplayMode.view ? (
						<p className="text-center text-white rounded-lg select-none">
							{" "}
							{`Reol #${rackData.id}`}{" "}
						</p>
					) : displayMode === DisplayMode.edit ? (
						<div className="flex flex-row items-center w-full h-fit justify-center gap-x-1.5 mt-1">
							<Minus
								className="stroke-white hover:cursor-pointer hover:scale-110 hover:stroke-gray-100"
								aria-label={"Fjern hylde"}
								onClick={(): void => {
									if (rackShelves[0].batches.length != 0) {
										ToastMessage({
											title: "Noget gik galt!",
											message: "Kan ikke fjerne hylde med batch.",
											type: "error",
										});
										return;
									} else if (rackShelves.length == 1) {
										ToastMessage({
											title: "Noget gik galt!",
											message: "Minimum være én hylde pr. reol",
											type: "error",
										});
										return;
									} else {
										// remove shelf from top
										fetch(`http://localhost:8080/Rack/${rackData.id}/Shelf`, {
											method: "DELETE",
										})
											.then((response: Response) => {
												// Check if the response is ok
												if (!response.ok) {
													ToastMessage({
														title: "Uventet fejl!",
														message:
															"Vi stødte på et problem, vent lidt og prøv igen",
														type: "error",
													});
													throw new Error("Network response was not ok");
												}
												return response.json();
											})
											.then((data): void => {
												setRackShelves(data.shelves);
												ToastMessage({
													title: "Hylde fjernet",
													message: "Hylden er blevet fjernet.",
													type: "success",
												});
											})

											// Error handling
											.catch((err): void => {
												ToastMessage({
													title: "Uventet fejl!",
													message:
														"Hylden kunne ikke fjernes, vent og prøv igen.",
													type: "error",
												});
												console.error("Error deleting shelf: " + err);
											});
									}
								}}
							/>
							<Plus
								className="stroke-white hover:cursor-pointer hover:scale-110 hover:stroke-gray-100"
								aria-label={"Tilføj hylde"}
								onClick={(): void => {
									// Check if there are more or equal to 7 shelves
									if (rackShelves.length >= 7) {
										// send Toast of error message!
										ToastMessage({
											title: "Noget gik galt!",
											message: "Der kan ikke være mere end 7 hylder på én roel",
											type: "error",
										});
										return;
									} else {
										// Add shelf to top
										fetch(`http://localhost:8080/Rack/${rackData.id}/Shelf`, {
											method: "POST",
										})
											.then((response: Response) => {
												// Check if the response is ok
												if (!response.ok) {
													ToastMessage({
														title: "Uventet fejl!",
														message:
															"Vi stødte på et problem, vent lidt og prøv igen",
														type: "error",
													});
													throw new Error("Network response was not ok");
												}
												ToastMessage({
													title: "Hylde tilføjet",
													message: "Der er blev tilføjet en hylde.",
													type: "success",
												});
												return response.json();
											})
											.then((data) => setRackShelves(data.shelves))
											// Error handling
											.catch((err): void => {
												ToastMessage({
													title: "Uventet fejl!",
													message: `Hylden kunne ikke oprettes, vent og prøv igen.`,
													type: "error",
												});
												console.error("Error deleting shelf: " + err);
											});
									}
								}}
							/>
							<Trash2
								className="stroke-white hover:cursor-pointer hover:scale-110 hover:stroke-gray-100"
								aria-label={"Fjern reol"}
								onClick={(): void => {
									// Check if rack is empty
									if (rackShelves.length != 0) {
										// send Toast as error message!
										ToastMessage({
											title: "Noget gik galt!",
											message: "Tøm reolen for at fjerne den,",
											type: "error",
										});
										return;
									} else {
										// Brug en dialog som confirmation til at fjerne reolen?
										ToastMessage({
											title: "Reol fjernet",
											message: "Reolen er blevet fjernet.",
											type: "success",
										});
									}
								}}
							/>
						</div>
					) : null}
				</div>

				{/* Shelf container */}
				<div className="flex flex-1 flex-col space-y-1 hover:cursor-pointer">
					{isLoading ? <p className="text-white">Is loading</p> : null}
					{rackShelves.map(
						(shelf: ShelfData, index: number): React.JSX.Element =>
							displayMode != DisplayMode.input ? (
								<Shelf
									displayMode={displayMode}
									key={index}
									{...shelf}
									isFewShelves={rackShelves.length <= 3}
								/>
							) : (
								<ShelfBox
									key={`${shelf.id}#${index}`}
									index={index}
									rack={shelf.id}
								/>
							),
					)}
				</div>
			</div>
			<RackDialog showDialog={showDialog} setShowDialog={setShowDialog} />
		</>
	);
};

export default DraggableBox;
