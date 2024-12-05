"use client";
/*
TODO:
	- (måske) gem i localstorage, alle racks hentet fra databasen, og kun tjek om der er sket ændringre siden sidste gang. Slipper muligvis for at skulle hente alle racks hver gang.
	- Error handling - tjek om racksene er oven i hindanden, og giv en fejlbesked.

*/

import React, {
	useState,
	useCallback,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import Rack, {
	RackData,
	rackHeight,
	rackWidth,
} from "@/components/map/Rack";
import { fetchWithAuth } from "@/components/authentication/authentication";

export enum DisplayMode {
	view,
	edit,
	input,
}

// Grid size for snapping
const GRID_SIZE = 50;

// Helper function to snap moving rack coordinates to grid
export const snapToGrid = (value: number) =>
	Math.abs(Math.round(value / GRID_SIZE) * GRID_SIZE);

async function updateRackPosition(rackData: RackData) {
	try {
		const response = await fetch(
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
			throw new Error("Bad response code");
		}
	} catch (e) {
		console.error("Error updating rack position: " + e);
	}
}

interface CanvasComponentProps {
	displayMode: DisplayMode;
}

export interface CanvasComponentMethods {
	newRack: (x: number, y: number) => void;
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
	const [hasBeenMoved, setHasBeenMoved] = useState(false);
	const [loadingRackIndexes, setLoadingRackIndexes] = useState<number[]>([]);

	// Fetch racks from the backend
	useEffect(() => {
		fetchWithAuth("http://localhost:8080/Racks", {})
			.then((response) => {
				// Check if the response is ok
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})

			// Set the boxes state to the racks
			.then((racks) => {
				setRacks(racks);
			})
			// Error handling
			.catch((err) => {
				console.error("Error getting racks: " + err);
			});
	}, []);

	const addNewRackFetch = useCallback(
		async (xCoordinate: number, yCoordinate: number, index: number) => {
			try {
				setLoadingRackIndexes([...loadingRackIndexes, index]);
				const response = await fetch("http://localhost:8080/Rack", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						xCoordinate: xCoordinate,
						yCoordinate: yCoordinate,
					}),
				});

				if (!response.ok) {
					throw new Error("Bad response code");
				}

				const newRack: RackData = await response.json();
				console.log("New rack", newRack);
				console.log(racks.length);
				const newRacks: RackData[] = racks.map((box, i) =>
					i === index ? newRack : box,
				);
				setRacks(newRacks);
				setLoadingRackIndexes(loadingRackIndexes.filter((i) => i !== index));
			} catch (e) {
				console.error("Error adding new rack: " + e);
			}
		},
		[racks, loadingRackIndexes],
	);

	const newRack = useCallback(
		(xPosition: number, yPosition: number) => {
			const newRackIndex = racks.length;
			const newRacks = [
				...racks,
				{
					id: -1,
					position: { x: xPosition, y: yPosition },
					shelves: [],
				},
			];
			setRacks(newRacks);
			addNewRackFetch(xPosition, yPosition, newRackIndex);
		},
		[addNewRackFetch, racks],
	);

	useEffect(() => {
		console.log("ref", ref);
	}, [ref]);

	useImperativeHandle(ref, () => {
		return {
			newRack: newRack,
		};
	});

	const updateRack = useCallback(
		(rack: RackData, index: number) => {
			const newRacks = racks.map((box, i) =>
				i === index ? { ...box, ...rack } : box,
			);
			setRacks(newRacks);
		},
		[racks],
	);

	const handleMouseMove = useCallback(
		function (event: React.MouseEvent<HTMLDivElement>) {
			if (selectedRackIndex === null || displayMode !== DisplayMode.edit)
				return;

			const rect = (
				event.currentTarget as HTMLDivElement
			).getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			// Convert client position to absolute position by removing pan offset and centering the boxes
			const xCoordinate = snapToGrid(mouseX - panOffset.x - rackWidth / 2);
			const yCoordinate = snapToGrid(mouseY - panOffset.y - rackHeight / 2);

			// Check for overlap and snap to grid if not overlapping
			const isOverlapping = racks.some((box, index) => {
				if (index === selectedRackIndex) return false;
				const xDelta = Math.abs(box.position.x - xCoordinate);
				const yDelta = Math.abs(box.position.y - yCoordinate);
				return xDelta < rackWidth && yDelta < rackHeight;
			});

			// Determind if a rack has been moved
			const hasRackBeenMoved =
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
		],
	);

	const handleMouseUp = useCallback(
		function () {
			if (selectedRackIndex !== null && hasBeenMoved) {
				updateRackPosition(racks[selectedRackIndex]);

				console.log("Update position", racks[selectedRackIndex].position);
			}
			setSelectedRackIndex(null);
		},
		[hasBeenMoved, selectedRackIndex, racks],
	);

	const rackMouseDownHandler = function (index: number) {
		setSelectedRackIndex(index);
	};

	useEffect(() => {
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [hasBeenMoved, selectedRackIndex, racks, handleMouseUp]);

	/*
  // Add event listeners for panning
  useEffect(() => {
    
    // Unselect
    if (isPanning) {
      document.addEventListener('mousemove', handlePanMove);
      document.addEventListener('mouseup', handlePanEnd);
    } else {
      document.removeEventListener('mousemove', handlePanMove);
      document.removeEventListener('mouseup', handlePanEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handlePanMove);
      document.removeEventListener('mouseup', handlePanEnd);
    };
  }, [isPanning, panStart, panOffset, handlePanMove, handlePanEnd]);
  */

	// Grid lines
	return (
		<div
			className="relative w-full h-full overflow-hidden z-1"
			onMouseMove={handleMouseMove}
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
				{racks.map((box, index) => (
					<Rack
						key={box.id}
						displayMode={displayMode}
						rackData={box}
						isSelected={selectedRackIndex === index}
						isLoading={loadingRackIndexes.some((i) => i === index)}
						mouseDownHandler={() => {
							rackMouseDownHandler(index);
						}}
					/>
				))}
			</div>
		</div>
	);
});

CanvasComponent.displayName = "CanvasComponent";
export default CanvasComponent;
