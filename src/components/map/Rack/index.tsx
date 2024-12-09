"use client";
import React, { useState } from "react";
import RackDialog, { setRackToBeDisplayed } from "../Dialog/RackDialog";

import ShelfBox from "@/components/map/ShelfInput";

import { DisplayMode } from "@/components/map/CanvasComponent";

import { ShelfData, Shelf } from "@/components/map/Shelf";

import {
	ToastMessage,
	UnexpectedErrorToast,
} from "@/functions/ToastMessage/ToastMessage";

import { Plus, Minus, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingScreen/LoadingSpinner";
import { fetchWithAuth } from "@/components/authentication/authentication";
import { endpoint } from "@/config/config";

//Constants
export const rackWidth: number = 100;
export const rackHeight: number = 200;

export interface RackData {
	id: number;
	position: { x: number; y: number };
	shelves: ShelfData[];
}

// DraggableBox component props
interface RackProps {
	rackData: RackData;
	isSelected: boolean | undefined;
	mouseDownHandler: ((e: React.MouseEvent<HTMLDivElement>) => void) | undefined;
	displayMode: DisplayMode;
	overrideColor?: string;
	removeRack?: () => void;
	getLocations?: (batchId: number) => string[];
	className?: string;
}

const Rack: React.FC<RackProps> = ({
	rackData,
	isSelected,
	mouseDownHandler,
	displayMode,
	overrideColor,
	removeRack,
	getLocations,
	className,
}) => {
	// State for position and dragging
	const [showDialog, setShowDialog] = useState<boolean>(false);
	const [rackShelves, setRackShelves] = useState<ShelfData[]>(rackData.shelves);

	const mouseDownHandlerWrapper = function (
		e: React.MouseEvent<HTMLDivElement>,
	) {
		e.stopPropagation();
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
		<div>
			<div
				className={`absolute flex flex-col rounded-lg p-1 outline outline-1 outline-offset-0 ${className} 
					${
						(overrideColor ? overrideColor : " bg-colorprimary ") +
						(isSelected ? " scale-105 border-black " : "cursor-grab ")
					} ${
						displayMode === DisplayMode.edit ||
						displayMode === DisplayMode.editPrototype
							? "cursor-grab active:cursor-grabbing"
							: displayMode === DisplayMode.view
								? "cursor-pointer"
								: "cursor-default"
					}`}
				onMouseDown={mouseDownHandlerWrapper}
				style={{
					left: rackData.position.x, // Adjust for pan offset visually only
					top: rackData.position.y, // Adjust for pan offset visually only
					width: rackWidth,
					height: rackHeight,
					border: isSelected ? "2px solid black" : "",
				}}
			>
				<div className="rounded-lg mb-1">
					{/* Show rack ID */}
					{displayMode === DisplayMode.input ||
					displayMode == DisplayMode.view ? (
						<p className="text-center text-white rounded-lg select-none">
							{`Reol #${rackData.id}`}
						</p>
					) : displayMode === DisplayMode.edit ||
					  displayMode === DisplayMode.editPrototype ? (
						<div className="flex flex-row items-center w-full h-fit justify-center gap-x-1.5 mt-1">
							<Minus
								className={
									"stroke-white " +
									(displayMode === DisplayMode.edit
										? "hover:cursor-pointer hover:scale-110 hover:stroke-gray-100"
										: undefined)
								}
								onMouseDown={(e) => {
									e.stopPropagation();
								}}
								onClick={() => {
									if (displayMode === DisplayMode.editPrototype) {
										return;
									}

									if (rackShelves.length === 0) {
										ToastMessage({
											title: "Noget gik galt",
											message: "Der er ingen hylder at fjerne",
											type: "error",
										});
									} else if (rackShelves[0].batches.length != 0) {
										ToastMessage({
											title: "Noget gik galt",
											message: "Kan ikke fjerne hylde med batch.",
											type: "error",
										});
										return;
									} else {
										// remove shelf from top
										fetchWithAuth(`${endpoint}/Rack/${rackData.id}/Shelf`, {
											method: "DELETE",
										})
											.then((response) => {
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
								className={
									"stroke-white " +
									(displayMode === DisplayMode.edit
										? "hover:cursor-pointer hover:scale-110 hover:stroke-gray-100"
										: undefined)
								}
								onMouseDown={(e) => {
									e.stopPropagation();
								}}
								aria-label={"Tilføj hylde"}
								onClick={() => {
									if (displayMode === DisplayMode.editPrototype) {
										return;
									}
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
										fetchWithAuth(`${endpoint}/Rack/${rackData.id}/Shelf`, {
											method: "POST",
										})
											.then((response) => {
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
								className={
									"stroke-white " +
									(displayMode === DisplayMode.edit
										? "hover:cursor-pointer hover:scale-110 hover:stroke-gray-100"
										: undefined)
								}
								onMouseDown={(e) => {
									e.stopPropagation();
								}}
								aria-label={"Fjern reol"}
								onClick={() => {
									if (displayMode === DisplayMode.editPrototype) {
										return;
									}
									// Check if rack is empty
									if (
										rackShelves.reduce(
											(acc, shelf) => acc + shelf.batches.length,
											0,
										) != 0
									) {
										// send Toast as error message!
										ToastMessage({
											title: "Noget gik galt",
											message: "Tøm reolen før du kan fjerne den.",
											type: "error",
										});
										return;
									} else {
										// Add shelf to top
										fetchWithAuth(`${endpoint}/Rack/${rackData.id}`, {
											method: "DELETE",
										})
											.then((response) => {
												// Check if the response is ok
												if (!response.ok) {
													UnexpectedErrorToast();
													throw new Error("Network response was not ok");
												} else {
													if (removeRack) {
														ToastMessage({
															title: "Reol fjernet",
															message: "Reolen er blevet fjernet.",
															type: "success",
														});
														removeRack();
													}
												}
											})
											.catch((err) => {
												UnexpectedErrorToast();
												console.error("Error deleting rack: " + err);
											});
									}
								}}
							/>
						</div>
					) : null}
				</div>

				{/* Shelf container */}
				<div className="flex flex-1 flex-col space-y-1">
					{displayMode === DisplayMode.loading ? (
						<LoadingSpinner
							size={50}
							className="stroke-white container mt-10"
						/>
					) : null}

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
								rackId={rackData.id}
								position={index}
								id={shelf.id}
							/>
						),
					)}
				</div>
			</div>
			{getLocations && (
				<RackDialog
					showDialog={showDialog}
					setShowDialog={setShowDialog}
					getLocations={getLocations}
				/>
			)}
		</div>
	);
};

export default Rack;
