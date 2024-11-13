import React from "react";

interface WeekDayProps {
	currentDay: string,
	days: Date[],
}

const WeekDay = ({currentDay, days }: WeekDayProps) => {

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-GB").replace(/\//g, "-");
	};

	const defaultStyle = 'w-[140px] py-2 text-center bg-sidebarcolor text-black rounded content-center'
	const currentDayStyle = 'w-[140px] py-2 text-center bg-colorprimary text-white rounded content-center'

	return (
		<>
			<div className={currentDay === formatDate(days[0]) ? currentDayStyle : defaultStyle }>
				<h1 className="text-xl font-bold uppercase">mandag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[0])}</p>
			</div>
			<div className={currentDay === formatDate(days[1]) ? currentDayStyle : defaultStyle }>
				<h1 className="text-xl font-bold uppercase">tirsdag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[1])}</p>
			</div>
			<div className={currentDay === formatDate(days[2]) ? currentDayStyle : defaultStyle }>
				<h1 className="text-xl font-bold uppercase">onsdag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[2])}</p>
			</div>
			<div className={currentDay === formatDate(days[3]) ? currentDayStyle : defaultStyle }>
				<h1 className="text-xl font-bold uppercase">torsdag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[3])}</p>
			</div>
			<div className={currentDay === formatDate(days[4]) ? currentDayStyle : defaultStyle }>
				<h1 className="text-xl font-bold uppercase">fredag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[4])}</p>
			</div>
			<div className={currentDay === formatDate(days[5]) ? currentDayStyle : defaultStyle }>
				<h1 className="text-xl font-bold uppercase">lørdag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[5])}</p>
			</div>
			<div className={currentDay === formatDate(days[6]) ? currentDayStyle : defaultStyle }>
				<h1 className="text-xl font-bold uppercase">søndag</h1>
				<p className="text-sm text-center font-extralight">{formatDate(days[6])}</p>
			</div>
		</>
	);
};

export default WeekDay;

