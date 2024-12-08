import React from "react";

interface WeekDayProps {
	currentDay: string;
	days: Date[];
}

const WeekDay = ({ currentDay, days }: WeekDayProps) => {
	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-GB").replace(/\//g, "-");
	};

	const defaultStyle: string =
		"w-full py-2 text-center bg-sidebarcolor text-black rounded content-center";
	const currentDayStyle: string =
		"w-full py-2 text-center bg-colorprimary text-white rounded content-center";

	const dayNames = [
		"mandag",
		"tirsdag",
		"onsdag",
		"torsdag",
		"fredag",
		"lørdag",
		"søndag",
	];

	return (
		<>
			{days.map((day, index) => (
				<div
					key={index}
					className={
						currentDay === formatDate(day) ? currentDayStyle : defaultStyle
					}
				>
					<h1 className="text-xl font-bold uppercase">{dayNames[index]}</h1>
					<p className="text-sm text-center font-extralight">
						{formatDate(day)}
					</p>
				</div>
			))}
		</>
	);
};

export default WeekDay;
