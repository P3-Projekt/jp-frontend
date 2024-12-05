"use client";

import DraggableBox, { rackWidth, rackHeight } from "@/components/map/Rack";
import React, {
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	DisplayMode,
	snapToGrid,
	CanvasComponentMethods,
} from "@/components/map/CanvasComponent";

export const EditMenu: React.FC<{
	canvasRef: RefObject<HTMLDivElement>;
	canvasComponentRef: RefObject<CanvasComponentMethods>;
}> = ({ canvasRef, canvasComponentRef }) => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isMouseDown, setIsMouseDown] = useState(false);
	const elementRef = useRef<HTMLDivElement>(null!);

	const isMouseInsideCanvas = useCallback(
		function (e: MouseEvent): boolean {
			if (canvasRef.current) {
				const canvasOffset: DOMRect = canvasRef.current.getBoundingClientRect();
				return e.clientX >= canvasOffset.left;
			}
			return false;
		},
		[canvasRef],
	);

	const getPositionRelativeToCanvas = useCallback(
		function (e: MouseEvent) {
			if (!canvasRef.current) throw new Error("Canvas ref is not set");

			const canvasOffset: DOMRect = canvasRef.current.getBoundingClientRect();

			let canvasRelativeX: number = e.clientX - canvasOffset.left;
			let canvasRelativeY: number = e.clientY - canvasOffset.top;

			if (isMouseInsideCanvas(e)) {
				canvasRelativeX = snapToGrid(canvasRelativeX - rackWidth / 2);
				canvasRelativeY = snapToGrid(canvasRelativeY - rackHeight / 2);
			} else {
				//Offset by height and width of rack
				canvasRelativeX -= rackWidth / 2;
				canvasRelativeY -= rackHeight / 2;
			}
			return {
				canvasRelativeX: canvasRelativeX,
				canvasRelativeY: canvasRelativeY,
			};
		},
		[canvasRef, isMouseInsideCanvas],
	);

	const setMouseUp = useCallback(
		function (e: MouseEvent): void {
			//Create new rack
			if (canvasComponentRef.current && isMouseDown) {
				const { canvasRelativeX, canvasRelativeY } =
					getPositionRelativeToCanvas(e);
				if (canvasRelativeX >= 0 && canvasRelativeY >= 0) {
					canvasComponentRef.current.newRack(canvasRelativeX, canvasRelativeY);
				}
			}
			//Reset moveable rack position
			setPosition({ x: 0, y: 0 });
			//Release mouse
			setIsMouseDown(false);
		},
		[isMouseDown, canvasComponentRef, getPositionRelativeToCanvas],
	);

	const setMouseDown = function (): void {
		setIsMouseDown(true);
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent): void => {
			if (isMouseDown && elementRef.current && canvasRef.current) {
				const containerOffset: DOMRect =
					elementRef.current.getBoundingClientRect();
				const canvasOffset: DOMRect = canvasRef.current.getBoundingClientRect();

				const { canvasRelativeX, canvasRelativeY } =
					getPositionRelativeToCanvas(e);

				const canvasRelativeToContainerX: number =
					canvasOffset.left - containerOffset.left;
				const canvasRelativeToContainerY: number =
					canvasOffset.top - containerOffset.top;

				setPosition({
					x: canvasRelativeToContainerX + canvasRelativeX,
					y: canvasRelativeToContainerY + canvasRelativeY,
				});
			}
		},
		[isMouseDown, canvasRef, getPositionRelativeToCanvas],
	);

	useEffect(() => {
		window.addEventListener("mouseup", setMouseUp);
		window.addEventListener("mousemove", handleMouseMove);
		return (): void => {
			window.removeEventListener("mouseup", setMouseUp);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [isMouseDown, handleMouseMove, setMouseUp]);

	return (
		<div className="w-[250px] h-full bg-lightgrey flex flex-col items-center">
			<div className="bg-colorprimary w-full text-center border-b-2 border-black">
				<h1 className="text-white font-bold text-2xl text-center mt-2 mb-2">
					Redigeringsmenu
				</h1>
			</div>
			<div className="grid grid-rows-4 gap-y-4 w-full items-center my-8">
				<div
					className="mx-5 h-full relative flex items-center justify-center"
					style={{ height: "300px" }}
				>
					<div className="flex flex-col items-center w-full h-full bg-gray-400 rounded-xl text-center">
						{" "}
						{/* Background box */}
						<p className="text-black text-xl font-bold m-4">Tilføj Reol</p>
						<div
							ref={elementRef}
							className="relative flex justify-center items-center"
							style={{
								width: "0",
								height: "0",
								zIndex: "100",
								left: `${-rackWidth / 2}px`,
							}}
						>
							{" "}
							{/* Adjusted wrapper */}
							<DraggableBox
								rackData={{
									id: 0,
									position: position,
									shelves: [],
								}}
								mouseDownHandler={setMouseDown}
								isSelected={undefined}
								displayMode={DisplayMode.edit}
								isLoading={false}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
