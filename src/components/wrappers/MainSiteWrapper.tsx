import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

const MainSiteWrapper = ({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) => {
	return (
		<div className={cn("mx-auto w-full max-w-screen-xl p-4", className)}>
			{children}
		</div>
	);
};
export default MainSiteWrapper;
