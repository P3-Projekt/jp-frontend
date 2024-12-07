"use client";
import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const MainSiteWrapper = ({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) => {
	const router = useRouter();
	const path = usePathname();

	useEffect(() => {
		const authToken = localStorage.getItem("authToken");
		if (!authToken && path !== "/login") {
			router.push("/login");
		} else if (authToken && path === "/login") {
			router.push("/");
		}
	}, [router, path]);
	return (
		<div
			className={cn(
				"mx-auto w-full max-w-screen max-h-screen pl-[350px]",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default MainSiteWrapper;
