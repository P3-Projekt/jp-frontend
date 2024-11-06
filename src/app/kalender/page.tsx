'use client';
import React, {useState} from 'react';
import { ChevronLeft, ChevronRight, Droplets, MoveRight, Scissors } from "lucide-react";



/*
TODOS:
- Datoerne skal gøres dynamiske, med uge nummrene.
- (Måske) skal der tilføjes en reset knap ved uge nummeret. Så man kan komme tilbage til den nuværende uge.
- (Måske) der kan tilføjet sådan at ugerne kan tages frem og tilbage med piletasterne.
-


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
						// start from 1 in the new year
						setWeekNumber(52)
					}
				}}/>
				<h1 className="text-colorprimary text-4xl cursor-default">UGE <span className="underline underline-offset-4">{weekNumber}</span></h1>
				<ChevronRight className="size-10 hover:cursor-pointer hover:scale-110" onClick={() => {
					if (weekNumber < 52) {
						setWeekNumber(weekNumber + 1);
					} else {
						setWeekNumber(1)
						// start from 1 in the new year
					}
				}}/>
			</div>
			{/* DAGE */}
			<div className="mt-3 flex flex-row justify-center gap-x-2 cursor-default">
				<div className="w-[140px] py-2.5 text-center bg-colorprimary rounded content-center">
					<h1 className="text-xl font-bold">MANDAG</h1>
					<p className="text-xs text-center">08-10-2024</p>
				</div>
				<div className="w-[140px] text-center bg-gray-200 text-black rounded content-center">
					<h1 className="text-xl font-bold">TIRSDAG</h1>
					<p className="text-xs text-center">09-10-2024</p>
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
			<div className="mt-3 flex flex-row justify-center gap-x-2 h-4/5">
				<div className="grid w-[140px] bg-colorprimary rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold"> {BatchIdSpecies} </span> </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
					</ul>
				</div>
				<div className="grid w-[140px] bg-gray-200 text-black rounded">
					<ul className="grid grid-rows-10 w-100 h-100 divide-y divide-black text-center">
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Droplets className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<Scissors className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
						<div className="flex flex-grow flex-row row-span-1 text-lg justify-center items-center">
							<MoveRight className="size-7 -mt-0.5" />
							<li className="text-center pl-2"> {BatchIdAmount}x <span className="font-semibold">{BatchIdSpecies}</span> </li>
						</div>
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
