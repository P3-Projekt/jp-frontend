import type { Metadata } from "next";
import "./globals.css";
import React from 'react';
import Sidebar from '@/components/Sidebar';
import MainSiteWrapper from '@/components/wrappers/MainSiteWrapper';
import {cn} from "@/app/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
	children: React.ReactNode;
}

// Metadata
export const metadata: Metadata = {
	title: "Test",
	description: "Test app",
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
		<html lang='en'>
			<body className={cn('min-h-screen font-sans antialiased grainy', inter.className)}>
				<div className="min-h-screen flex">
					<Sidebar />
						<MainSiteWrapper>
							{children}
						</MainSiteWrapper>
				</div>
			</body>
		</html>
    );
};
export default Layout;
