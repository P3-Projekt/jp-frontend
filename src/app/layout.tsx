"use client";
import "./globals.css";
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MainSiteWrapper from "@/components/wrappers/MainSiteWrapper";
import { cn } from "@/app/lib/utils";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const pathname = usePathname(); // Get the current route

	// Determine if the sidebar should be shown
	const showSidebar = pathname !== "/login";

	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen font-sans antialiased grainy overflow-hidden",
					inter.className,
				)}
			>
				<div className="min-h-screen flex">
					{/* Conditionally render Sidebar */}
					{showSidebar && <Sidebar />}
					<MainSiteWrapper>{children}</MainSiteWrapper>
					<Toaster />
				</div>
			</body>
		</html>
	);
};

export default Layout;
