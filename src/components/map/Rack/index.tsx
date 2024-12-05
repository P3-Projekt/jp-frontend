"use client";
import React, { useState } from "react";
import RackDialog, { setRackToBeDisplayed } from "../Dialog/RackDialog";
import ShelfBox from "@/components/Rack/Shelf";
import { fetchWithAuth } from "@/components/authentication/authentication";

import { DisplayMode } from "@/components/map/CanvasComponent";

import { ShelfData, Shelf } from "@/components/map/Shelf";

import { useToast } from "@/hooks/use-toast";

import { Plus, Minus, Trash2 } from "lucide-react";

//Constants
export const rackWidth = 100;
export const rackHeight = 200;

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
	) {
		if (displayMode === DisplayMode.view) {
			setRackToBeDisplayed(rackData);
			setShowDialog(true);
		}
		if (mouseDownHandler) {
			mouseDownHandler(e);
		}
	};

	const { toast } = useToast();

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
								onClick={() => {
									console.log(rackShelves[0].batches.length);

									if (rackShelves[0].batches.length != 0) {
										toast({
											variant: "destructive",
											title: "Noget gik galt",
											description: "Kan ikke fjerne hylde med batch.",
										});
										return;
									} else if (rackShelves.length == 1) {
										toast({
											variant: "destructive",
											title: "Noget gik galt",
											description: "Minimum én hylde pr. reol",
										});
									} else {
										// remove shelf from top
										fetchWithAuth(
											`http://localhost:8080/Rack/${rackData.id}/Shelf`,
											{
												method: "DELETE",
											},
										)
											.then((response) => {
												// Check if the response is ok
												if (!response.ok) {
													toast({
														variant: "destructive",
														title: "Noget gik galt",
														description:
															"Hylden kunne ikke slettes - prøv igen.",
													});
													throw new Error("Network response was not ok");
												}
												return response.json();
											})
											.then((data) => {
												setRackShelves(data.shelves);
											})

											// Error handling
											.catch((err) => {
												toast({
													variant: "destructive",
													title: "Noget gik galt",
													description: "Hylden kunne ikke slettes - prøv igen.",
												});
												console.error("Error deleting shelf: " + err);
											});
									}
								}}
							/>
							<Plus
								className="stroke-white hover:cursor-pointer hover:scale-110 hover:stroke-gray-100"
								onClick={() => {
									// Check if there are more or equal to 7 shelves
									if (rackShelves.length >= 7) {
										// send Toast of error message!
										toast({
											variant: "destructive",
											title: "Noget gik galt",
											description: "Kan ikke tilføje mere end 7 hylder.",
										});
										return;
									} else {
										// Add shelf to top
										fetchWithAuth(
											`http://localhost:8080/Rack/${rackData.id}/Shelf`,
											{
												method: "POST",
											},
										)
											.then((response) => {
												// Check if the response is ok
												if (!response.ok) {
													toast({
														variant: "destructive",
														title: "Noget gik galt",
														description:
															"Kunne ikke tilføje hylden - prøv igen.",
													});
													throw new Error("Network response was not ok");
												}
												return response.json();
											})
											.then((data) => setRackShelves(data.shelves))
											// Error handling
											.catch((err) => {
												toast({
													variant: "destructive",
													title: "Noget gik galt",
													description: "Kunne ikke tilføje hylden - prøv igen.",
												});
												console.error("Error deleting shelf: " + err);
											});
									}
								}}
							/>
							<Trash2
								className="stroke-white hover:cursor-pointer hover:scale-110 hover:stroke-gray-100"
								onClick={() => {
									// Check if rack is empty
									if (rackShelves.length != 0) {
										// send Toast as error message!
										toast({
											variant: "destructive",
											title: "Noget gik galt",
											description:
												"Reolen skal være tom for at kunne fjerne den.",
										});
										return;
									} else {
										// Brug en dialog som confirmation til at fjerne reolen?
										console.log("RACK DELETED!");
									}
								}}
							/>
						</div>
					) : null}
				</div>

				{/* Shelf container */}
				<div className="flex flex-1 flex-col space-y-1 hover:cursor-pointer">
					{isLoading ? <p className="text-white">Is loading</p> : null}
					{rackShelves.map((shelf, index) =>
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
