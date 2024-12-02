'use client';

import React from "react";
import { EditMenu } from "@/components/edit/EditMenu";

import CanvasComponent, {DisplayMode} from "@/components/map/CanvasComponent";


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
	return (
		<div className="h-full flex">
			{/* Edit Menu */}
			<div className=" bg-gray-100">
				<EditMenu />
			</div>

			{/* Canvas */}
			<div className="flex-1 bg-white">
				<CanvasComponent 
					displayMode={DisplayMode.edit}
				/>
			</div>
		</div>
	);
};

export default RedigeringstilstandPage;
