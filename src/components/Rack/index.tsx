import React from "react";
import ShelfBox from "./Shelf";
import { ShelfData } from "@/app/pregermination/page";
import { RackData } from "@/app/pregermination/page";

const RackBox: React.FC<RackData> = ({ id, shelves }) => {
	console.log(shelves);

	return (
		// Rack container
		<div className="flex flex-col h-[300px] w-[150px] bg-colorprimary rounded-lg p-1">
			{/* Rack name container */}
			<div className="bg-colorprimary rounded-lg mb-1">
				<p className="text-center text-white rounded-lg">{`Reol #${id}`}</p>
			</div>

			{/* Shelf container */}
			<div className="flex flex-1 flex-col space-y-1">
				{Array.from({ length: shelves.length }).map((_, index) => (
					<ShelfBox key={`${id}#${index}`} position={index} rackId={id} id={shelves[index].id} />
				))}
			</div>
		</div>
	);
};

export default RackBox;
