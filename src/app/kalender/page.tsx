'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Task from "@/app/kalender/Task";
import WeekDay from "@/app/kalender/WeekDay";



/*
TODOS:
- (Måske) skal der tilføjes en reset knap ved uge nummeret. Så man kan komme tilbage til den nuværende uge.
- Opgaver skal kunne åbnes og lukkes. Brug muligvis ShadCN dialog component
- Som der er nu slettes opgaver fra bunden - Er det okay, eller skal der kunne være tomme felter mellem opgaver?
- (Måske) der skal gemmes hvilken uge brugeren er på i stedet for at hente den hver gang. (altså i localstorage eller lign.) så det huske det.
- Lav alt spacing til at bruge calc i stedet for faste værdier.
- Lav udfør opave confirm knappen til at være en anden farve end den røde.
- Brug skeleton loading til at vise at der er noget der loader. når der hentes data. (Der kan bruges noget smart med React suspense component)
- Fjen funktionaliteten ved confirm og delete knapperne. (Så de ikke gør noget, når der er trykket på dem).
- Skal laves sådan at opaverne faktisk kan udføres og slettes. (Altså at der sker noget når der trykkes på udfør og slet opgave) (Skal laves senere)
-
*/


const KalenderPage: React.FC = () => {

	const currentWeekNumber= getCurrentWeekNumber(new Date());

	const [weekNumber, setWeekNumber] = useState(currentWeekNumber);

	const BatchIdAmount = 50;
	const BatchIdSpecies = "Ærter";

	// Functionality to change week number with arrow keys
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				setWeekNumber(prevWeekNumber => prevWeekNumber > 1 ? prevWeekNumber - 1 : 52);
			} else if (event.key === 'ArrowRight') {
				setWeekNumber(prevWeekNumber => prevWeekNumber < 52 ? prevWeekNumber + 1 : 1);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<>
		{/* UGER */}
		<div className="w-[calc(100%-20px)] h-screen -mt-3 flex flex-col justify-center select-none overflow-hidden">
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
			<div className="mt-3 flex flex-row justify-center gap-x-2 h-4/5">
				<div className="grid w-[140px] bg-colorprimary rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"water"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"harvest"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
						<Task taskType={"move"} batchIdSpecies={BatchIdSpecies} batchIdAmount={BatchIdAmount} />
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
