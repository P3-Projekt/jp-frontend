'use client';
import React, {useState} from 'react';
import { ChevronLeft, ChevronRight, Droplets, MoveRight, Scissors } from "lucide-react";

const KalenderPage: React.FC = () => {

	const currentWeekNumber= getWeekNumber(new Date());

	const [week, setWeek] = useState(currentWeekNumber);

	const BatchIdAmount = 50;
	const BatchIdSpecies = "Ærter";

	return (
		<>
		{/* UGER */}
		<div className=" mt-10 flex flex-col justify-center">
			<div className="flex flex-row justify-center">
				<ChevronLeft className="size-10 cursor-pointer hover:scale-110" onClick={() => {
					setWeek(week - 1);
				}}/>
				<h1 className="text-colorprimary text-4xl">UGE <u>{week}</u></h1>
				<ChevronRight className="size-10 hover:cursor-pointer hover:scale-110" onClick={() => {
					setWeek(week + 1);
				}}/>
			</div>
			{/* DAGE */}
			<div className="mt-9 flex flex-row justify-center gap-x-3 cursor-default">
				<div className="w-[140px] py-2.5 text-center bg-colorprimary rounded content-center">
					<h1 className="text-xl font-bold">MANDAG</h1>
					<p className="text-xs text-center">06-10-2024</p>
				</div>
				<div className="w-[140px] text-center bg-gray-200 text-black rounded content-center">
					<h1 className="text-xl font-bold">TIRSDAG</h1>
					<p className="text-xs text-center">07-10-2024</p>
				</div>
				<div className="w-[140px] text-center bg-gray-200 text-black rounded content-center">
					<h1 className="text-xl font-bold">ONSDAG</h1>
					<p className="text-xs text-center">08-10-2024</p>
				</div>
				<div className="w-[140px] text-center bg-gray-200 text-black rounded content-center">
					<h1 className="text-xl font-bold">TORSDAG</h1>
					<p className="text-xs text-center">09-10-2024</p>
				</div>
				<div className="w-[140px] text-center bg-gray-200 text-black rounded content-center">
					<h1 className="text-xl font-bold">FREDAG</h1>
					<p className="text-xs text-center">10-10-2024</p>
				</div>
				<div className="w-[140px] text-center bg-gray-200 text-black rounded content-center">
					<h1 className="text-xl font-bold">LØRDAG</h1>
					<p className="text-xs text-center">11-10-2024</p>
				</div>
				<div className="w-[140px] text-center bg-gray-200 text-black rounded content-center">
					<h1 className="text-xl font-bold">SØNDAG</h1>
					<p className="text-xs text-center">12-10-2024</p>
				</div>
			</div>
			{/* OPGAVER */}
			<div className="mt-4 flex flex-row justify-center gap-x-3">
				<div className="grid w-[140px] bg-colorprimary rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center align-bottom">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center align-bottom">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center align-bottom">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center align-bottom">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center align-bottom">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center align-bottom">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7" />
							<li className="text-center"> {BatchIdAmount}x {BatchIdSpecies} </li>
						</div>
					</ul>
				</div>
				<div className="w-[140px] bg-gray-200 text-black rounded content-center">
					<ul className="flex flex-col gap-y-3 divide-y divide-black text-center">
						<li className="">8</li>
						<li>9</li>

						<li>10</li>
						<li>11</li>
						<li>12</li>
						<li>13</li>
						<li>14</li>
						<li>15</li>
						<li>16</li>
						<li>17</li>
						<li>18</li>
						<li>19</li>
						<li>20</li>
						<li>21</li>
						<li>22</li>
						<li>23</li>
						<li>24</li>
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
function getWeekNumber(date) {
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
