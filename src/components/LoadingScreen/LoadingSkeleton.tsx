import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

const LoadingSkeleton: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<LoadingSpinner />
		</div>
	);
};

export default LoadingSkeleton;
