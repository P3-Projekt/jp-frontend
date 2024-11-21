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
	category: "harvest" | "water" | "move";
	batchId: number;
	dueDate: Date;
}

const Task = ({ fields, plantType, category, batchId }: TaskProps) => {
	const [openDialog, setOpenDialog] = useState(false);
	/*const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
	const [animationStage, setAnimationStage] = useState<"idle" | "loading" | "completed">("idle");
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	 const { toast } = useToast()
	 */

	let taskIcon = <></>;
	let dialogTaskIcon = <> </>;
	let backgroundColor = "bg-blue-400";
	let type = null;
	switch (category) {

		case "harvest":
			type = "høst";
			break;
		case "water":
			type = "vand";
			break;
		case "move":
			type = "flyt";
			break;
		default:
			type = "";
	}

	switch (category) {
		case "harvest":
			taskIcon = <Scissors className="size-7 mt-0.5" />;
			dialogTaskIcon = <Scissors className="size-12" />;
			backgroundColor = "bg-green-500";
			break;
		case "water":
			taskIcon = <Droplets className="size-7 -mt-0.5" />;
			dialogTaskIcon = <Droplets className="size-12" />;
			backgroundColor = "bg-blue-500";
			break;
		case "move":
			taskIcon = <MoveRight className="size-7 mt-0.5" />;
			dialogTaskIcon = <MoveRight className=" size-12 pt-1" />;
			backgroundColor = "bg-orange-500";
			break;
		default:
			taskIcon = <></>;
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
					{fields}x{" "}
					<span className="font-semibold"> {plantType} </span>{" "}
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
								<div className="text-black">
									{dialogTaskIcon}
								</div>
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
							Reoler:{" "}
							<span className="font-bold text-colorprimary cursor-text">
								{/*{batchIdShelf}*/}
							</span>
							<br />
						</DialogDescription>
						<DialogFooter>
							<div className="w-full flex flex-row justify-between gap-y-4 mt-2">
								<Link
									href="/"
									className={buttonVariants({
										variant: "black",
									})}
									onClick={() => {
										// Send til kortF<p
										setOpenDialog(false);
									}}
								>
									<p className="uppercase font-bold">
										vis lokation
									</p>
								</Link>
							</div>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			{/* Delete confirmation */}

			{/* Completion confirm */}
			{/* <AlertDialog open={openConfirmAlert} onOpenChange={setOpenConfirmAlert}>
				<AlertDialogContent className="bg-white opacity-100">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-black text-2xl">Udfør denne opgave?</AlertDialogTitle>
						<AlertDialogDescription className="text-black text-md italic">
							Denne handling <span className="underline">kan ikke fortrydes</span>. Dette vil fuldføre opgaven og fjerne den fra listen.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="grid grid-cols-2 grid-row-1 justify-items-center">
						<AlertDialogAction className="min-w-[165px] bg-green-600 border-none hover:bg-green-700 uppercase font-bold text-white" onClick={(e) => {
							e.preventDefault();
							setIsButtonDisabled(true);
							// Animate task completion:
							setAnimationStage("loading");
							setTimeout(() => {
								setAnimationStage("completed");
								setTimeout(() => {
									//  Complete the task
									try {
										setOpenConfirmAlert(false);
										setOpenDialog(false);
										setAnimationStage("idle");

										toast({
											variant: "success",
											title: "Opgaven er fuldført",
											description: "Opgaven er nu fuldført og fjernet fra listen.",
										})

									} catch(err) {
										toast({
											variant: "destructive",
											title: "Noget gik galt",
											description: err,
										})
									}
									setIsButtonDisabled(false);
								}, 1000); // Duration for showing the checkmark
							}, 2000); // Duration for showing the loading spinner (SKAL PASSE MED DATA HENTNING (FETCH)).
						}}
						disabled={isButtonDisabled}
						>
							{animationStage === "idle" && <><Check/> Udfør opgaven</>}
							{animationStage === "loading" && <><Loader className="animate-spin" /></>}
							{animationStage === "completed" && <><Check/></>}
						</AlertDialogAction>

						<AlertDialogAction className="min-w-[165px] bg-zinc-950 border-none text-white uppercase font-bold hover:bg-zinc-800" disabled={isButtonDisabled}>
							Fortryd
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog> */}
		</>
	);
};

export default Task;
