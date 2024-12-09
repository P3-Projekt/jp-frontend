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

	// If current day is the same as the day in the loop, set the column style to be primary color
	const columnStyle = (day: string) =>
		day === currentDay
			? "grid w-full bg-colorprimary text-white rounded"
			: "grid w-full bg-sidebarcolor text-black rounded";

	// Get tasks for the selected week
	const fetchTasks = useCallback(async () => {
		try {
			const response = await fetchWithAuth(
				`${endpoint}/Tasks?weekNumber=${weekNumber}`,
			);
			if (!response.ok) throw new Error("Failed to fetch tasks");
			const tasks = await response.json();
			setTasks(tasks); // Set tasks
		} catch (error) {
			console.error(error);
		}
	}, [weekNumber]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	// Show tasks for the selected day
	const selectedDayTask = (selectedDay: Date) => {
		const dayTasks = tasks.filter(
			(task) => formatDate(new Date(task.dueDate)) === formatDate(selectedDay),
		);

		return dayTasks.map((task) => <Task key={task.taskId} {...task} />);
	};

	// Change week number
	const changeWeek = (increment: number) => {
		setWeekNumber((prev) => {
			const newWeek = prev + increment;
			if (newWeek < 1) {
				// If the week is less than 1, subtract 1 from the year
				setYear((prevYear) => prevYear - 1);
				return 52;
			}
			if (newWeek > 52) {
				// If the week is greater than 52, add 1 to the year
				setYear((prevYear) => prevYear + 1);
				return 1;
			}
			return newWeek;
		});
	};

	// Listen for arrow key presses to change week
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") changeWeek(-1);
			if (event.key === "ArrowRight") changeWeek(1);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="w-full h-full flex flex-col justify-center select-none p-8 ">
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
			{/* Tasks */}
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
