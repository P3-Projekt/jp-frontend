"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Undo2 } from "lucide-react";
import Task from "@/app/kalender/Task";
import WeekDay from "@/app/kalender/WeekDay";
import { TaskProps } from "@/app/kalender/Task";

/*
TODOS:
- Lav alt spacing til at bruge calc i stedet for faste værdier.

Med Backend
- Loading tiderne ved at trykke på udfør og slet opgave skal være dynamiske, så de passer med det call der bliver lavet til backend.
- Skal laves sådan at opaverne faktisk kan udføres og slettes. (Altså at der sker noget når der trykkes på udfør og slet opgave) (Skal bruge backend)
- Skal kunne hente opgaver, med en given batchId, og en given uge. (Skal bruge backend)
*/

const KalenderPage: React.FC = () => {
	// Get current week number
	const currentWeekNumber: number = getCurrentWeekNumber(new Date());
	const currentYear: number = new Date().getFullYear();

	// State for week number
	const [weekNumber, setWeekNumber] = useState(currentWeekNumber);
	const [year, setYear] = useState(currentYear);
	const [tasks, setTasks] = useState<TaskProps[]>([])

	const currentDay: string = formatDate(new Date());
	const daysInWeek: Date[] = getDatesInWeek(weekNumber, year);

	// Styles for task columns
	const defaultColumnStyle: string =
		"grid w-full bg-sidebarcolor text-black rounded";
	const currentDayColumnStyle: string =
		"grid w-full bg-colorprimary text-white rounded";

	// Get week number from local storage
	useEffect(() => {
		const savedWeekNumber = localStorage.getItem("weekNumber");
		const savedYear = localStorage.getItem("year");
		if (savedWeekNumber) {
			setWeekNumber(parseInt(savedWeekNumber, 10));
		}
		if (savedYear) {
			setYear(parseInt(savedYear, 10));
		}
	}, []);



	useEffect(() => {
		// Fetch tasks from backend
		const fetchTasks = async () => {
			const data = await fetch(process.env.NEXT_PUBLIC_URL + `Tasks?weekNumber=${weekNumber}`)
			setTasks(await data.json());
		}
		fetchTasks();
	}, [weekNumber])

	const selectedDayTask = (selectedDay: Date): React.ReactNode => {
		const normalizedSelectedDay = new Date(selectedDay.setHours(0, 0, 0, 0));

		const filteredTasks = tasks.filter((task) => {
		  const taskDueDate = new Date(task.dueDate);
		  const normalizedTaskDate = new Date(taskDueDate.setHours(0, 0, 0, 0));

		  return normalizedTaskDate.getTime() === normalizedSelectedDay.getTime();
		});

		if (filteredTasks.length === 0) return null;

		return filteredTasks.map((task) => (
			<div className="content-center" key={task.taskId}>


		  <Task
			taskId={task.taskId}
			batchId={task.batchId}
			category={task.category.toLowerCase() as "harvest" | "water" | "move"}
			plantType={task.plantType}
			fields={task.fields}
			dueDate={task.dueDate}
		  />
		  </div>
		));
	  };




	// Save week number to local storage
	useEffect(() => {
		localStorage.setItem("weekNumber", weekNumber.toString());
		localStorage.setItem("year", year.toString());
	}, [weekNumber, year]);

	// Functionality to change week number with arrow keys
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") {
				if (weekNumber > 1) {
					setWeekNumber(weekNumber - 1);
				} else {
					setWeekNumber(52);
					setYear(year - 1);
				}
			} else if (event.key === "ArrowRight") {
				if (weekNumber < 52) {
					setWeekNumber(weekNumber + 1);
				} else {
					setWeekNumber(1);
					setYear(year + 1);
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [weekNumber, year]);

	return (
		<>
			{/* UGER */}
			<div className="w-full h-full flex flex-col justify-center select-none overflow-hidden">
				<div className="flex flex-row justify-center">
					<ChevronLeft
						aria-label="Forige uge"
						className="size-10 cursor-pointer hover:scale-110"
						onClick={() => {
							if (weekNumber > 1) {
								setWeekNumber(weekNumber - 1);
							} else {
								// start from 1 in the past year
								setWeekNumber(52);
								setYear(year - 1);
							}
						}}
					/>
					<h1
						aria-label="Ugenummer"
						className="text-colorprimary text-4xl cursor-default font-extrabold"
					>
						UGE{" "}
						<span className="underline underline-offset-3">
							{weekNumber}
						</span>
					</h1>
					<ChevronRight
						aria-label="Næste uge"
						className="size-10 hover:cursor-pointer hover:scale-110"
						onClick={() => {
							if (weekNumber < 52) {
								setWeekNumber(weekNumber + 1);
							} else {
								// start from 1 in the new year
								setWeekNumber(1);
								setYear(year + 1);
							}
						}}
					/>
					<Undo2
						aria-label="Gå til nuværende uge"
						className="size-9 mt-0.5 hover:cursor-pointer hover:scale-110"
						onClick={() => {
							setWeekNumber(currentWeekNumber);
							setYear(currentYear);
						}}
					/>
				</div>
				{/* DAGE */}
				<div className="mt-3 flex flex-row justify-center gap-x-2 cursor-default">
					<WeekDay currentDay={currentDay} days={daysInWeek} />
				</div>

				{/* OPGAVER */}
				<div className="mt-3 flex flex-row justify-center gap-x-2 h-full">
				{daysInWeek.map((day, index) => (
					<div
					key={index}
					className={
						currentDay === formatDate(day)
						? currentDayColumnStyle
						: defaultColumnStyle
					}
					>
					<ul className="grid grid-rows-12 w-100 h-full divide-y divide-black text-center m-2">
					{selectedDayTask(day)}
					</ul>
					</div>
				))}
				</div>

			</div>
		</>
	);
};

export default KalenderPage;

/**
 * Get the current week number
 * @param date
 * @returns current week number
 */
function getCurrentWeekNumber(date: Date): number {
	const msPerDay = 86400000;

	const firstThursday: Date = new Date(date.getFullYear(), 0, 1);

	while (firstThursday.getDay() !== 4) {
		firstThursday.setDate(firstThursday.getDate() + 1);
	}

	const currentThursday: Date = new Date(date);

	while (currentThursday.getDay() !== 4) {
		currentThursday.setDate(currentThursday.getDate() - 1);
	}

	return Math.ceil(
		((currentThursday.getTime() - firstThursday.getTime()) / msPerDay + 1) /
			7,
	);
}

/**
 * Get the dates in a week
 * @param week
 * @param year
 * @returns dates in a week
 */
function getDatesInWeek(week: number, year: number) {
	const firstDayOfYear = new Date(year, 0, 1);
	const days = Array.from({ length: 7 }, (_, i) => {
		const day = new Date(firstDayOfYear.getTime());
		day.setDate(firstDayOfYear.getDate() + (week - 1) * 7 + i);
		return day;
	});
	return days;
}

/**
 * Format date to DD-MM-YYYY
 * @param date
 * @returns formatted date
 */
function formatDate(date: Date) {
	return date.toLocaleDateString("en-GB").replace(/\//g, "-");
}

