'use client';
import React, {useState} from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Task from "@/app/kalender/Task";
import WeekDay from "@/app/kalender/WeekDay";



/*
TODOS:
- (Måske) skal der tilføjes en reset knap ved uge nummeret. Så man kan komme tilbage til den nuværende uge.
- (Måske) der kan tilføjet sådan at ugerne kan tages frem og tilbage med piletasterne.
- Opgaver skal kunne åbnes og lukkes. Brug muligvis ShadCN dialog component
*/


const KalenderPage: React.FC = () => {

	const currentWeekNumber= getCurrentWeekNumber(new Date());

	const [weekNumber, setWeekNumber] = useState(currentWeekNumber);

	const BatchIdAmount = 50;
	const BatchIdSpecies = "Ærter";

	return (
		<>
		{/* UGER */}
		<div className="h-screen -mt-3 flex flex-col justify-center select-none">
			<div className="flex flex-row justify-center">
				<ChevronLeft className="size-10 cursor-pointer hover:scale-110" onClick={() => {
					if (weekNumber > 1) {
						setWeekNumber(weekNumber - 1);
					} else {
						// start from 1 in the past year
						setWeekNumber(52)
					}
				}}/>
				<h1 className="text-colorprimary text-4xl cursor-default">UGE <span className="underline underline-offset-4">{weekNumber}</span></h1>
				<ChevronRight className="size-10 hover:cursor-pointer hover:scale-110" onClick={() => {
					if (weekNumber < 52) {
						setWeekNumber(weekNumber + 1);
					} else {
						// start from 1 in the new year
						setWeekNumber(1)
					}
				}}/>
			</div>
			{/* DAGE */}
			<div className="mt-3 flex flex-row justify-center gap-x-2 cursor-default">
				<WeekDay week={weekNumber}/>
			</div>
			{/* OPGAVER */}
			<div className="mt-3 flex flex-row justify-center gap-x-2 h-4/5 transition-all ease-in-out duration-100">
				<div className="grid w-[140px] bg-colorprimary rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
					</ul>
				</div>
			</div>
		</div>
		</>
	);
};

export default KalenderPage;

/**
 * Get the week number of the year
 * @param date
 * @returns week number
 */
function getCurrentWeekNumber(date) {
	const millisecondInDay = 86400000
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date - firstDayOfYear) / millisecondInDay;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
