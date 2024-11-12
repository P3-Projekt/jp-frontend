'use client';
import React, {useState, useEffect} from 'react';
import {ChevronLeft, ChevronRight, Undo2 } from "lucide-react";
import Task from "@/app/kalender/Task";
import WeekDay from "@/app/kalender/WeekDay";



/*
TODOS:
- Lav alt spacing til at bruge calc i stedet for faste værdier.
- Brug skeleton loading til at vise at der er noget der loader. når der hentes data. (Der kan bruges noget smart med React suspense component)
- Gør sådan at det kun er den nuværende dato der er markeret med en anden farve.
-

Med Backend
- Loading tiderne ved at trykke på udfør og slet opgave skal være dynamiske, så de passer med det call der bliver lavet til backend.
- Skal laves sådan at opaverne faktisk kan udføres og slettes. (Altså at der sker noget når der trykkes på udfør og slet opgave) (Skal bruge backend)
- Skal kunne hente opgaver, med en given batchId, og en given uge. (Skal bruge backend)
-
*/


const KalenderPage: React.FC = () => {
	// Get current week number
	const currentWeekNumber = getCurrentWeekNumber(new Date());
	const currentYear = new Date().getFullYear();

	// State for week number
	const [weekNumber, setWeekNumber] = useState(currentWeekNumber);
	const [year, setYear] = useState(currentYear);

	// Constants for tasks
	const batchIdAmount = 50;
	const batchIdSpecies = "Ærter";
	const batchId = 1;

	// Get week number from local storage
	useEffect(() => {
		const savedWeekNumber = localStorage.getItem('weekNumber');
		const savedYear = localStorage.getItem('year');
		if (savedWeekNumber) {
			setWeekNumber(parseInt(savedWeekNumber, 10));
		}
		if (savedYear) {
			setYear(parseInt(savedYear, 10));
		}
	}, []);

	// Save week number to local storage
	useEffect(() => {
		localStorage.setItem('weekNumber', weekNumber.toString());
		localStorage.setItem('year', year.toString());
	}, [weekNumber, year]);

	// Functionality to change week number with arrow keys
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				if (weekNumber > 1) {
					setWeekNumber(weekNumber - 1);
				} else {
					setWeekNumber(52);
					setYear(year - 1);
				}
			} else if (event.key === 'ArrowRight') {
				if (weekNumber < 52) {
					setWeekNumber(weekNumber + 1);
				} else {
					setWeekNumber(1);
					setYear(year + 1);
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [weekNumber, year]);

	return (
		<>
		{/* UGER */}
		<div className="w-[calc(100%-20px)] h-full -mt-3 flex flex-col justify-center select-none overflow-hidden">
			<div className="flex flex-row justify-center">
				<ChevronLeft aria-label="Forige uge" className="size-10 cursor-pointer hover:scale-110" onClick={() => {
					if (weekNumber > 1) {
						setWeekNumber(weekNumber - 1);
					} else {
						// start from 1 in the past year
						setWeekNumber(52)
						setYear(year - 1);
					}
				}}/>
				<h1 aria-label="Ugenummer" className="text-colorprimary text-4xl cursor-default font-extrabold">UGE <span className="underline underline-offset-3">{weekNumber}</span></h1>
				<ChevronRight aria-label="Næste uge" className="size-10 hover:cursor-pointer hover:scale-110" onClick={() => {
					if (weekNumber < 52) {
						setWeekNumber(weekNumber + 1);
					} else {
						// start from 1 in the new year
						setWeekNumber(1)
						setYear(year + 1);
					}
				}}/>
				<Undo2 aria-label="Gå til nuværende uge" className="size-9 mt-0.5 hover:cursor-pointer hover:scale-110" onClick={() => {
					setWeekNumber(currentWeekNumber);
					setYear(currentYear);
				}}/>
			</div>
			{/* DAGE */}
			<div className="mt-3 flex flex-row justify-center gap-x-2 cursor-default">
				<WeekDay week={weekNumber} year={year}/>
			</div>
			{/* OPGAVER */}
			<div className="mt-3 flex flex-row justify-center gap-x-2 h-4/5">
				<div className="grid w-[140px] bg-colorprimary rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
						<div className="content-center"></div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-sidebarcolor text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"move"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"harvest"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
						<div className="content-center"><Task batchId={batchId} taskType={"water"} batchIdSpecies={batchIdSpecies} batchIdAmount={batchIdAmount} /></div>
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
