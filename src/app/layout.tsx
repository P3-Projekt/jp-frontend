import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from 'react';
import Sidebar from '@/components/Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

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
