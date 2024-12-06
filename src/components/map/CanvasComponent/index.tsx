"use client";
import React, {
	useState,
	useCallback,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import Rack, { RackData, rackHeight, rackWidth } from "@/components/map/Rack";
import { fetchWithAuth } from "@/components/authentication/authentication";
import { ToastMessage } from "@/functions/ToastMessage/ToastMessage";

export enum DisplayMode {
	view,
	edit,
	editPrototype,
	input,
	loading,
}

// Grid size for snapping
const GRID_SIZE: number = 50;

// Helper function to snap moving rack coordinates to grid
export const snapToGrid = (value: number) =>
	Math.round(value / GRID_SIZE) * GRID_SIZE;

async function updateRackPosition(rackData: RackData): Promise<void> {
	try {
		const response : Response = await fetchWithAuth(
			"http://localhost:8080/Rack/" + rackData.id + "/Position",
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					xCoordinate: rackData.position.x,
					yCoordinate: rackData.position.y,
				}),
			},
		);

		if (!response.ok) {
			ToastMessage({
				title: "Uventet fejl!",
				message: "Vi stødte på et problem, vent og prøv igen.",
				type: "error",
			});
			throw new Error("Bad response code");
		}
	} catch (e) {
		ToastMessage({
			title: "Noget gik galt!",
			message: "Kunne opdatere reol placeringen",
			type: "error",
		});
		console.error("Error updating rack position: " + e);
	}
}

interface CanvasComponentProps {
	displayMode: DisplayMode;
}

export interface CanvasComponentMethods {
	newRack: (x: number, y: number) => void;
	getOffset: () => { x: number; y: number };
	isPositionOverlapping: (position: { x: number; y: number }) => boolean;
}

// CanvasComponent component
const CanvasComponent = forwardRef<
	CanvasComponentMethods,
	CanvasComponentProps
>(({ displayMode }, ref) => {
	const [racks, setRacks] = useState<RackData[]>([]);
	const [selectedRackIndex, setSelectedRackIndex] = useState<number | null>(
		null,
	);

	const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
	const [panStart, setPanStart] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const [hasBeenMoved, setHasBeenMoved] = useState(false);
	const [loadingRacks, setLoadingRacks] = useState<Map<number, RackData>>(
		new Map(),
	);

	// Fetch racks from the backend
	useEffect((): void => {
		fetchWithAuth("http://localhost:8080/Racks", {})
			.then((response: Response) => {
				// Check if the response is ok
				if (!response.ok) {
					ToastMessage({
						title: "Uventet fejl!",
						message: "Vi stødte på et problem, vent og prøv igen.",
						type: "error",
					});
					throw new Error("Network response was not ok");
				}
				return response.json();
			})

			// Set the boxes state to the racks
			.then((racks): void => {
				setRacks(racks);
			})

			// Error handling
			.catch((err): void => {
				ToastMessage({
					title: "Noget gik galt!",
					message: "Vi kunne ikke hente reolerne, prøv at genindlæse siden.",
					type: "error",
				});
				console.error("Error getting racks: " + err);
			});
	}, []);

	const addNewRackFetch = useCallback(
		async (tempId: number, data: RackData) => {
			try {
				const response = await fetchWithAuth("http://localhost:8080/Rack", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						xCoordinate: data.position.x,
						yCoordinate: data.position.y,
					}),
				});

				if (!response.ok) {
					ToastMessage({
						title: "Uventet fejl!",
						message: "Vi stødte på et problem, vent og prøv igen.",
						type: "error",
					});
					throw new Error("Bad response code" + response);
				}

				const newRack: RackData = await response.json();
				//Remove from loading
				const newLoadingRacks = new Map(loadingRacks);
				newLoadingRacks.delete(tempId);
				setLoadingRacks(newLoadingRacks);
				//Add to racks
				const newRacks = [...racks, newRack];
				setRacks(newRacks);
			} catch (e) {
				console.error("Error adding new rack: " + e);
			}
		},
		[racks, loadingRacks],
	);

	const isPositionOverlapping = useCallback(
		function (position: { x: number; y: number }) {
			return racks.some((box) => {
				const xDelta = Math.abs(box.position.x - position.x);
				const yDelta = Math.abs(box.position.y - position.y);
				return xDelta < rackWidth && yDelta < rackHeight;
			});
		},
		[racks],
	);

	const newRack = useCallback(
		(xPosition: number, yPosition: number) => {
			if (isPositionOverlapping({ x: xPosition, y: yPosition })) {
				return;
			}

			const tempId =
				Math.max(...racks.map((rack) => rack.id), ...loadingRacks.keys()) + 1;

			const newRack = {
				id: tempId,
				position: { x: xPosition, y: yPosition },
				shelves: [],
			};

			const newLoadingRacks = new Map(loadingRacks);
			newLoadingRacks.set(tempId, newRack);
			setLoadingRacks(newLoadingRacks);

			addNewRackFetch(tempId, newRack);
		},
		[addNewRackFetch, racks, isPositionOverlapping, loadingRacks],
	);

	useImperativeHandle(ref, () => {
		return {
			newRack: newRack,
			getOffset: () => panOffset,
			isPositionOverlapping: isPositionOverlapping,
		};
	}, [panOffset, newRack, isPositionOverlapping]);

	const updateRack = useCallback(
		(rack: RackData, index: number): void => {
			const newRacks = racks.map((box: RackData, i: number) =>
				i === index ? { ...box, ...rack } : box,
			);
			setRacks(newRacks);
		},
		[racks],
	);

	const handlePanMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isPanning) {
				return;
			}

			const panDeltaX = e.clientX - panStart.x;
			const panDeltaY = e.clientY - panStart.y;

			const newOffsetX = panOffset.x + panDeltaX;
			const newOffsetY = panOffset.y + panDeltaY;

			setPanOffset({ x: newOffsetX, y: newOffsetY });
			setPanStart({ x: e.clientX, y: e.clientY });
		},
		[isPanning, panStart, panOffset],
	);

	const handleMouseMove = useCallback(
		function (event: React.MouseEvent<HTMLDivElement>) {
			if (isPanning) {
				handlePanMove(event);
			}

			if (selectedRackIndex === null || displayMode !== DisplayMode.edit) {
				return;
			}

			const rect: DOMRect = (
				event.currentTarget as HTMLDivElement
			).getBoundingClientRect();
			const mouseX: number = event.clientX - rect.left;
			const mouseY: number = event.clientY - rect.top;

			// Convert client position to absolute position by removing pan offset and centering the boxes
			const xCoordinate: number = snapToGrid(
				mouseX - panOffset.x - rackWidth / 2,
			);
			const yCoordinate: number = snapToGrid(
				mouseY - panOffset.y - rackHeight / 2,
			);

			// Check for overlap and snap to grid if not overlapping
			const isOverlapping: boolean = racks.some(
				(box: RackData, index: number): boolean => {
					if (index === selectedRackIndex) return false;
					const xDelta: number = Math.abs(box.position.x - xCoordinate);
					const yDelta: number = Math.abs(box.position.y - yCoordinate);
					return xDelta < rackWidth && yDelta < rackHeight;
				},
			);

			// Determind if a rack has been moved
			const hasRackBeenMoved: boolean =
				xCoordinate !== racks[selectedRackIndex].position.x ||
				yCoordinate !== racks[selectedRackIndex].position.y;

			// Update position if not overlapping and has changed
			if (!isOverlapping && hasRackBeenMoved) {
				setHasBeenMoved(true);
				updateRack(
					{
						...racks[selectedRackIndex],
						position: { x: xCoordinate, y: yCoordinate },
					},
					selectedRackIndex,
				);
			}
		},
		[
			selectedRackIndex,
			displayMode,
			panOffset.x,
			panOffset.y,
			racks,
			updateRack,
			isPanning,
			handlePanMove,
		],
	);

	const handleMouseUp = useCallback(
		function () {
			setIsPanning(false);
			if (selectedRackIndex !== null && hasBeenMoved) {
				updateRackPosition(racks[selectedRackIndex]);
			}
			setSelectedRackIndex(null);
		},
		[hasBeenMoved, selectedRackIndex, racks],
	);

	const rackMouseDownHandler = function (index: number) {
		if (displayMode === DisplayMode.edit) {
			setSelectedRackIndex(index);
		}
	};

	const removeRack = useCallback(
		function (indexToRemove: number) {
			const newRacks = racks.filter((box, i) => i !== indexToRemove);
			setRacks(newRacks);
		},
		[racks],
	);

	const getLocationsByBatch = useCallback(
		function (batchId: number) {
			const locations: string[] = [];

			for (const rack of racks) {
				for (const [index, shelf] of rack.shelves.entries()) {
					if (shelf.batches.some((batch) => batch.id === batchId)) {
						locations.push(`${rack.id}.${index + 1}`);
					}
				}
			}
			return locations;
		},
		[racks],
	);

	useEffect(() => {
		document.addEventListener("mouseup", handleMouseUp);

		return (): void => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [hasBeenMoved, selectedRackIndex, racks, handleMouseUp]);

	const startPanning = function (event: React.MouseEvent<HTMLDivElement>) {
		setIsPanning(true);
		setPanStart({ x: event.clientX, y: event.clientY });
	};

	// Grid lines
	return (
		<div
			className="relative w-full h-full overflow-hidden z-1 cursor-grab active:cursor-grabbing"
			onMouseMove={handleMouseMove}
			onMouseDown={startPanning}
		>
			<div
				className="absolute w-full h-full inset-0 pointer-events-none opacity-40"
				style={{
					backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
					backgroundPosition: `${panOffset.x % GRID_SIZE}px ${panOffset.y % GRID_SIZE}px`,
					backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 0.25px), linear-gradient(to bottom, #ccc 1px, transparent 0.25px)`,
				}}
			/>
			<div
				style={{
					transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
				}}
				className="absolute inset-0"
			>
				{racks.map((box: RackData, index: number) => (
					<Rack
						key={box.id}
						displayMode={displayMode}
						rackData={box}
						isSelected={selectedRackIndex === index}
						mouseDownHandler={() => {
							rackMouseDownHandler(index);
						}}
						removeRack={() => {
							removeRack(index);
						}}
						getLocations={getLocationsByBatch}
					/>
				))}
				{Array.from(loadingRacks.values()).map((box) => (
					<Rack
						key={box.id}
						displayMode={DisplayMode.loading}
						rackData={box}
						isSelected={false}
						mouseDownHandler={() => {}}
					/>
				))}
			</div>
		</div>
	);
});

CanvasComponent.displayName = "CanvasComponent";
export default CanvasComponent;
