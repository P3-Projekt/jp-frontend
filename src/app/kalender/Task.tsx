import {Droplets, MoveRight, Scissors} from "lucide-react";
import React from "react";

interface TaskProps {
	batchIdAmount: number;
	batchIdSpecies: string; // Dette skal laves til kun at være alle de forskellige plantearter
	taskType: ("harvest" | "water" | "move");
}

const Task = ({batchIdAmount, batchIdSpecies, taskType}: TaskProps) => {
	let taskIcon = <> </>;
	switch(taskType) {
		case("harvest"):
			taskIcon = <Scissors className="size-7 -mt-0.5" />;
			break;
		case ("water"):
			taskIcon = <Droplets className="size-7 -mt-0.5" />;
			break;
		case ("move"):
			taskIcon = <MoveRight className="size-7 -mt-0.5" />;
			break;
		default:
			taskIcon = <></>;
	}

	return (
		<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
			{taskIcon}
			<li className="text-center pl-2"> {batchIdAmount}x <span className="font-semibold"> {batchIdSpecies} </span> </li>
		</div>
	);
}

export default Task;
