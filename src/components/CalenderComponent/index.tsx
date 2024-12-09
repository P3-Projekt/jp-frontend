"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Undo2 } from "lucide-react";
import Task from "@/components/CalenderComponent/Task";
import WeekDay from "@/components/CalenderComponent/WeekDay";
import { TaskProps } from "@/components/CalenderComponent/Task";
import { fetchWithAuth } from "@/components/authentication/authentication";
import { formatDate, getCurrentWeekNumber, getDatesInWeek } from "./util";
import { endpoint } from "@/config/config";

const KalenderPage: React.FC = () => {
	const currentWeekNumber = getCurrentWeekNumber();
	const currentYear = new Date().getFullYear();

	const [weekNumber, setWeekNumber] = useState(currentWeekNumber);
	const [year, setYear] = useState(currentYear);
	const [tasks, setTasks] = useState<TaskProps[]>([]);

	const daysInWeek = getDatesInWeek(weekNumber, year);
	const currentDay = formatDate(new Date());

	// Hvis dag er den samme som den nuværende dag, så skal farven være primary, ellers skal den være sidebarcolor
	const columnStyle = (day: string) =>
		day === currentDay
			? "grid w-full bg-colorprimary text-white rounded"
			: "grid w-full bg-sidebarcolor text-black rounded";

	// Hent opgaver fra API
	const fetchTasks = useCallback(async () => {
		try {
			const response = await fetchWithAuth(
				`${endpoint}/Tasks?weekNumber=${weekNumber}`,
			);
			if (!response.ok) throw new Error("Failed to fetch tasks");
			const tasks = await response.json();
			setTasks(tasks); // Sætter tasks til at være de hentede opgaver
		} catch (error) {
			console.error(error);
		}
	}, [weekNumber]);

	useEffect(() => {
		fetchTasks(); // Hent opgaver
	}, [fetchTasks]);

	// Vis opgaver for den valgte dag
	const selectedDayTask = (selectedDay: Date) => {
		const dayTasks = tasks.filter(
			(task) => formatDate(new Date(task.dueDate)) === formatDate(selectedDay),
		);

		return dayTasks.map((task) => <Task key={task.taskId} {...task} />);
	};

	// Skift uge
	const changeWeek = (increment: number) => {
		setWeekNumber((prev) => {
			const newWeek = prev + increment;
			if (newWeek < 1) {
				// Hvis ugen er mindre end 1, så skal året trækkes fra 1
				setYear((prevYear) => prevYear - 1);
				return 52;
			}
			if (newWeek > 52) {
				// Hvis ugen er større end 52, så skal året tilføjes 1
				setYear((prevYear) => prevYear + 1);
				return 1;
			}
			return newWeek;
		});
	};

	// Lyt efter tastatur input for at skifte uge
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") changeWeek(-1);
			if (event.key === "ArrowRight") changeWeek(1);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="w-full h-full flex flex-col justify-center select-none overflow-hidden m-8">
			<div className="flex flex-row justify-center items-center gap-4">
				<ChevronLeft
					aria-label="Forrige uge"
					className="cursor-pointer hover:scale-110"
					onClick={() => changeWeek(-1)}
				/>
				<h1 className="text-colorprimary text-4xl font-extrabold">
					UGE <span className="underline underline-offset-3">{weekNumber}</span>
				</h1>
				<ChevronRight
					aria-label="Næste uge"
					className="cursor-pointer hover:scale-110"
					onClick={() => changeWeek(1)}
				/>
				<Undo2
					aria-label="Gå til nuværende uge"
					className="cursor-pointer hover:scale-110"
					onClick={() => {
						setWeekNumber(currentWeekNumber);
						setYear(currentYear);
					}}
				/>
			</div>
			<div className="mt-3 flex flex-row justify-center gap-x-2">
				<WeekDay currentDay={currentDay} days={daysInWeek} />
			</div>
			{/* Opgaver */}
			<div className="mt-3 flex flex-row justify-center gap-x-2 h-full">
				{daysInWeek.map((day, index) => (
					<div key={index} className={columnStyle(formatDate(day))}>
						<ul className="grid grid-rows-12 gap-y-2 p-2">
							{selectedDayTask(day)}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
};

export default KalenderPage;
