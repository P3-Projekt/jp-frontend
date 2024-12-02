'use client';

import React, { useRef } from "react";
import { EditMenu } from "@/components/edit/EditMenu";

import CanvasComponent, {CanvasComponentMethods, DisplayMode} from "@/components/map/CanvasComponent";


/*
TODO:
	- Der skal laves grid
	- Elementerne fra sidemenuen skal kunne dragges ind i griddet
	- Fix sidemenuen
	- Fix farver
	- Importer racks fra databasen som i 2D kortet
	- Lav +, -, og slet knap i toppen på en rack.
	- Fjern batches fra racken
	- Gør sådan at racken kan flyttes.

*/

const RedigeringstilstandPage: React.FC = () => {

	const canvasRef = useRef<HTMLDivElement>(null);
	const canvasComponentRef = useRef<CanvasComponentMethods>(null);

	return (
		<div className="h-full flex">
			{/* Edit Menu */}
			<div className=" bg-gray-100">
				<EditMenu 
					canvasRef={canvasRef}
					canvasComponentRef={canvasComponentRef}
				/>
			</div>

			{/* Canvas */}
			<div className="flex-1 bg-white"
			ref={canvasRef}
			>
				<CanvasComponent
					ref={canvasComponentRef}
					displayMode={DisplayMode.edit}
				/>
			</div>
		</div>
	);
};

export default RedigeringstilstandPage;
