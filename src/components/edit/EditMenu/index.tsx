"use client";

import Rack, { rackWidth, rackHeight } from "@/components/map/Rack";
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
	const [isRackRed, setIsRackRed] = useState(false);

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
			if (!canvasRef.current || !canvasComponentRef.current)
				throw new Error("Canvas ref is not set");

			const offset = canvasComponentRef.current.getOffset();

			const canvasOffset: DOMRect = canvasRef.current.getBoundingClientRect();

			let canvasRelativeX: number = e.clientX - canvasOffset.left;
			let canvasRelativeY: number = e.clientY - canvasOffset.top;

			if (isMouseInsideCanvas(e)) {
				canvasRelativeX = snapToGrid(
					canvasRelativeX - offset.x - rackWidth / 2,
				);
				canvasRelativeY = snapToGrid(
					canvasRelativeY - offset.y - rackHeight / 2,
				);
			} else {
				//Offset by height and width of rack
				canvasRelativeX -= offset.x + rackWidth / 2;
				canvasRelativeY -= offset.y + rackHeight / 2;
			}
			return {
				canvasRelativeX: canvasRelativeX,
				canvasRelativeY: canvasRelativeY,
			};
		},
		[canvasRef, isMouseInsideCanvas, canvasComponentRef],
	);

	const setMouseUp = useCallback(
		function (e: MouseEvent): void {
			//Create new rack
			if (canvasComponentRef.current && isMouseDown && isMouseInsideCanvas(e)) {
				const { canvasRelativeX, canvasRelativeY } =
					getPositionRelativeToCanvas(e);
				//Fix this
				canvasComponentRef.current.newRack(canvasRelativeX, canvasRelativeY);
			}
			//Reset moveable rack position
			setPosition({ x: 0, y: 0 });
			//Release mouse
			setIsMouseDown(false);
			setIsRackRed(false);
		},
		[
			isMouseDown,
			canvasComponentRef,
			getPositionRelativeToCanvas,
			isMouseInsideCanvas,
		],
	);

	const setMouseDown = function (): void {
		setIsMouseDown(true);
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent) : void => {
			if (
				isMouseDown &&
				elementRef.current &&
				canvasRef.current &&
				canvasComponentRef.current
			) {
				const containerOffset : DOMRect = elementRef.current.getBoundingClientRect();
				const canvasOffset : DOMRect = canvasRef.current.getBoundingClientRect();

				const { canvasRelativeX, canvasRelativeY } =
					getPositionRelativeToCanvas(e);

				if (
					isMouseInsideCanvas(e) &&
					canvasComponentRef.current.isPositionOverlapping({
						x: canvasRelativeX,
						y: canvasRelativeY,
					})
				) {
					setIsRackRed(true);
				} else {
					setIsRackRed(false);
				}

				const canvasRelativeToContainerX : number =
					canvasOffset.left -
					containerOffset.left +
					canvasComponentRef.current.getOffset().x;
				const canvasRelativeToContainerY : number =
					canvasOffset.top -
					containerOffset.top +
					canvasComponentRef.current.getOffset().y;

				const newPositionX = canvasRelativeToContainerX + canvasRelativeX;
				const newPositionY = canvasRelativeToContainerY + canvasRelativeY;

				setPosition({
					x: newPositionX,
					y: newPositionY,
				});
			}
		},
		[
			isMouseDown,
			canvasRef,
			getPositionRelativeToCanvas,
			canvasComponentRef,
			isMouseInsideCanvas,
		],
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
							<Rack
								rackData={{
									id: 0,
									position: position,
									shelves: [],
								}}
								mouseDownHandler={setMouseDown}
								isSelected={undefined}
								displayMode={DisplayMode.editPrototype}
								overrideColor={
									isRackRed ? " bg-[hsl(var(--destructive))] " : undefined
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
