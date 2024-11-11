import React from "react";

interface WeekDayProps {
	week: number,
	year: number,
}

const WeekDay = ({ week, year }: WeekDayProps) => {
	const days = getDatesInWeek(week, year);

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-GB").replace(/\//g, "-");
	};

	return (
		<>
			<div className="w-[140px] py-2 text-center bg-colorprimary text-white rounded content-center">
				<h1 className="text-xl font-bold uppercase">mandag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[0])}</p>
			</div>
			<div className="w-[140px] text-center bg-sidebarcolor text-black rounded content-center">
				<h1 className="text-xl font-bold uppercase">tirsdag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[1])}</p>
			</div>
			<div className="w-[140px] text-center bg-sidebarcolor text-black rounded content-center">
				<h1 className="text-xl font-bold uppercase">onsdag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[2])}</p>
			</div>
			<div className="w-[140px] text-center bg-sidebarcolor text-black rounded content-center">
				<h1 className="text-xl font-bold uppercase">torsdag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[3])}</p>
			</div>
			<div className="w-[140px] text-center bg-sidebarcolor text-black rounded content-center">
				<h1 className="text-xl font-bold uppercase">fredag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[4])}</p>
			</div>
			<div className="w-[140px] text-center bg-sidebarcolor text-black rounded content-center">
				<h1 className="text-xl font-bold uppercase">lørdag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[5])}</p>
			</div>
			<div className="w-[140px] text-center bg-sidebarcolor text-black rounded content-center">
				<h1 className="text-xl font-bold uppercase">søndag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[6])}</p>
			</div>
		</>
	);
};

export default WeekDay;

function getDatesInWeek(week: number, year: number) {
	const firstDayOfYear = new Date(year, 0, 1);
	const days = Array.from({ length: 7 }, (_, i) => {
		const day = new Date(firstDayOfYear.getTime());
		day.setDate(firstDayOfYear.getDate() + (week - 1) * 7 + i);
		return day;
	});
	return days;
}
