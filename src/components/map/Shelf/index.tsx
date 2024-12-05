"use client";
import { BatchData, Batch } from "../Batch";
import { DisplayMode } from "../CanvasComponent";

export interface ShelfData {
	id: number;
	batches: BatchData[];
}

interface additionalArgs {
	isFewShelves: boolean;
	displayMode: DisplayMode;
}

type ShelfArguments = ShelfData & additionalArgs;

export const Shelf: React.FC<ShelfArguments> = ({
	batches,
	isFewShelves,
	displayMode,
}) => {
	return (
		<div className="flex-1 flex items-center justify-center rounded-lg bg-zinc-100">
			<div className="flex items-center">
				{displayMode !== DisplayMode.input
					? batches.map((batch: BatchData, index: number) => (
							<Batch
								key={index}
								{...batch}
								isFewBatches={batches.length <= 2}
								isFewShelves={isFewShelves}
							/>
						))
					: null}

				<div className="text-black text-center ml-1"></div>
			</div>
		</div>
	);
};
