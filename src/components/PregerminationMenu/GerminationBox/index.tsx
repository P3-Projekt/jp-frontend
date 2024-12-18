import React from "react";

interface GerminationProps {
	plantType: string;
	amount: number;
	daysUntilReady: number;
}

const GerminationBox: React.FC<GerminationProps> = ({
	plantType,
	amount,
	daysUntilReady,
}) => {
	return (
		<div className="p-2 mb-2 bg-sidebarcolor shadow-md rounded-lg">
			<p className="text-center text-black">
				{plantType}: {amount}, {daysUntilReady}{" "}
				{daysUntilReady > 1 ? "dage" : "dag"} tilbage
			</p>
		</div>
	);
};

export default GerminationBox;
