import type { Metadata } from "next";
import "./globals.css";
import React from 'react';
import Sidebar from '@/components/Sidebar';

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
			<body>
			<div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-grow p-4">
                {children}
            </div>
        </div>
			</body>
		</html>

    );
};

export default Layout;
