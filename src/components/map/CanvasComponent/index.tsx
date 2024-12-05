"use client";
import React, {
	useState,
	useCallback,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import DraggableBox, {
	RackData,
	rackHeight,
	rackWidth,
} from "@/components/map/Rack";
import { fetchWithAuth } from "@/components/authentication/authentication";
import { ToastMessage } from "@/functions/ToastMessage/ToastMessage";

export enum DisplayMode {
	view,
	edit,
	input,
}

// Grid size for snapping
const GRID_SIZE: number = 50;

// Helper function to snap moving rack coordinates to grid
export const snapToGrid = (value: number) =>
	Math.abs(Math.round(value / GRID_SIZE) * GRID_SIZE);

async function updateRackPosition(rackData: RackData): Promise<void> {
	try {
		const response: Response = await fetch(
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
		async (
			xCoordinate: number,
			yCoordinate: number,
			index: number,
		): Promise<void> => {
			try {
				setLoadingRackIndexes([...loadingRackIndexes, index]);
				const response: Response = await fetch("http://localhost:8080/Rack", {
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
					ToastMessage({
						title: "Uventet fejl!",
						message: "Vi stødte på et problem, vent og prøv igen.",
						type: "error",
					});
					throw new Error("Bad response code" + response);
				}

				const newRack: RackData = await response.json();
				const newRacks: RackData[] = racks.map(
					(box: RackData, i: number): RackData => (i === index ? newRack : box),
				);
				setRacks(newRacks);
				setLoadingRackIndexes(
					loadingRackIndexes.filter((i: number): boolean => i !== index),
				);
			} catch (e) {
				console.error("Error adding new rack: " + e);
			}
		},
		[racks, loadingRackIndexes],
	);

	const newRack = useCallback(
		(xPosition: number, yPosition: number): void => {
			const newRackIndex: number = racks.length;
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

	useImperativeHandle(ref, () => {
		return {
			newRack: newRack,
		};
	});

	const updateRack = useCallback(
		(rack: RackData, index: number): void => {
			const newRacks = racks.map((box: RackData, i: number) =>
				i === index ? { ...box, ...rack } : box,
			);
			setRacks(newRacks);
		},
		[racks],
	);

	const handleMouseMove = useCallback(
		function (event: React.MouseEvent<HTMLDivElement>): void {
			if (selectedRackIndex === null || displayMode !== DisplayMode.edit)
				return;

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
					ToastMessage({
						title: "Noget gik galt!",
						message: "Reolen overlapper en anden reol",
						type: "error",
					});
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
		],
	);

	const handleMouseUp = useCallback(
		function (): void {
			if (selectedRackIndex !== null && hasBeenMoved) {
				updateRackPosition(racks[selectedRackIndex]);
			}
			setSelectedRackIndex(null);
		},
		[hasBeenMoved, selectedRackIndex, racks],
	);

	const rackMouseDownHandler = function (index: number): void {
		setSelectedRackIndex(index);
	};

	useEffect(() => {
		document.addEventListener("mouseup", handleMouseUp);

		return (): void => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [hasBeenMoved, selectedRackIndex, racks, handleMouseUp]);

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
				{racks.map((box: RackData, index: number) => (
					<DraggableBox
						key={box.id}
						displayMode={displayMode}
						rackData={box}
						isSelected={selectedRackIndex === index}
						isLoading={loadingRackIndexes.some(
							(i: number): boolean => i === index,
						)}
						mouseDownHandler={(): void => {
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
