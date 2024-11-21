import Link from "next/link";
import Image from "next/image";
import React from "react";

const NotFound: React.FC = () => {
	return (
		<div className="flex flex-col justify-center items-center text-center min-h-screen -mt-24">
			<div
				aria-label="404"
				className="flex flex-row items-center justify-center"
			>
				<h1
					className="text-9xl -mr-6"
					style={{ textShadow: "#2D5446 6px 2px" }}
				>
					4
				</h1>
				<Image src="/plant.png" alt="plant" width={360} height={360} />
				<h1
					className="text-9xl -ml-6"
					style={{ textShadow: "#2D5446 6px 2px" }}
				>
					4
				</h1>
			</div>
			<div>
				<p aria-label="Siden blev ikke fundet" className="text-4xl">
					Denne side er i gang med at gro.
				</p>
			</div>
			<div>
				<p className="text-2xl">
					Mens den bliver færdig, kan du se på mikrogrønt{" "}
					<Link
						href="/"
						className="underline"
						aria-label="Tilabe til 2D kortet"
					>
						her
					</Link>
				</p>
			</div>
		</div>
	);
};

export default NotFound;
