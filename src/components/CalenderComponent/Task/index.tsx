"use client";
import { Droplets, MoveRight, Scissors, X } from "lucide-react";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

import { buttonVariants } from "@/components/ui/button";

import Link from "next/link";

export interface TaskProps {
	taskId: number;
	fields: number;
	plantType: number;
	category: "harvest" | "water" | "plant";
	batchId: number;
	dueDate: Date;
	isPlaced: boolean;
	completedAt: string | null;
	completedBy: string | null;
}

const categoryDetails = {
	harvest: {
		type: "høst",
		taskIcon: <Scissors className="size-7 mt-0.5" />,
		dialogTaskIcon: <Scissors className="size-12" />,
		backgroundColor: "bg-green-500",
	},
	water: {
		type: "vand",
		taskIcon: <Droplets className="size-7 -mt-0.5" />,
		dialogTaskIcon: <Droplets className="size-12" />,
		backgroundColor: "bg-blue-500",
	},
	plant: {
		type: "flyt",
		taskIcon: <MoveRight className="size-7 mt-0.5" />,
		dialogTaskIcon: <MoveRight className="size-12 pt-1" />,
		backgroundColor: "bg-orange-500",
	},
};

const Task = ({ fields, plantType, category, batchId, completedAt, completedBy, isPlaced }: TaskProps) => {
	const [openDialog, setOpenDialog] = useState(false);

	const { type, taskIcon, dialogTaskIcon, backgroundColor } =
		categoryDetails[category] || {};

	function getStatus(completedAt: string | null, completedBy: string | null) {
		if (completedAt && completedBy) {
			return `Gennemført af ${completedBy} @ ${new Date(completedAt).toLocaleString()}`;
		} else {
			return "Ikke færdig";
		}
	}

	return (
		<>
			{/* Task */}
			<div
				className={`text-white flex w-full h-full flex-grow flex-row row-span-1 text-lg justify-center items-center cursor-pointer rounded ${backgroundColor}`}
				onClick={() => setOpenDialog(true)}
			>
				{taskIcon}
				<li className="text-center pl-2 ">
					{fields}x <span className="font-semibold"> {plantType} </span>{" "}
				</li>
			</div>
			{/* Popup */}
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="bg-white opacity-100 min-w-[500px] min-h-[300px] [&>button]:hidden">
					<DialogHeader>
						<DialogTitle>
							<div className="flex flex-row justify-start items-center">
								<div className="text-black text-5xl uppercase font-bold cursor-default">
									{type}
								</div>
								<div className="text-black">{dialogTaskIcon}</div>
								<div className="ml-auto -mr-3">
									<X
										className="size-14 text-black cursor-pointer"
										onClick={() => {
											setOpenDialog(false);
										}}
									/>
								</div>
							</div>
						</DialogTitle>
						<DialogDescription>
							Batch ID:{" "}
							<span className="font-bold text-colorprimary cursor-text">
								{batchId}
							</span>
							<br />
							Sort:{" "}
							<span className="font-bold text-colorprimary cursor-text">
								{plantType}
							</span>
							<br />
							Antal marker:{" "}
							<span className="font-bold text-colorprimary cursor-text">
								{fields}
							</span>
							<br />
							Status:{" "}
							<span className="font-bold text-colorprimary cursor-text">
								{getStatus(completedAt, completedBy)}
							</span>
							<br />
							
						</DialogDescription>
						<DialogFooter>
							{isPlaced ? 
							<div className="w-full flex flex-row justify-between gap-y-4 mt-2">
							<Link
								href={`/?batchId=${batchId}`}
								className={buttonVariants({
									variant: "black",
								})}
								onClick={() => {
									// Send til kort
									setOpenDialog(false);
								}}
							>
								<p className="uppercase font-bold">vis lokation</p>
							</Link>
						</div>
							: null}
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Task;
