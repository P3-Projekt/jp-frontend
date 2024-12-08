"use client";
import React from "react";
import SidebarItem from "./SidebarItem";
import sidebarConfig from "@/config/config";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { LogOut, User } from 'lucide-react';

const Sidebar: React.FC = () => {

	// Decode authToken to get user information
	const authToken = typeof window !== "undefined" ? localStorage.getItem('authToken') : null;
	const decodedToken = authToken ? JSON.parse(atob(authToken.split('.')[1])) : null;
	
	return (
		<div className="flex flex-col justify-start w-[350px] z-10 fixed h-screen">
			<div className="sidebar bg-sidebarcolor p-8 w-full h-full">
				<Link href="/">
					<Image src="/logo.png" width={500} height={500} alt="Logo" />
				</Link>
				<ul>
					{sidebarConfig.map((item, index) => (
						<li key={index}>
							<SidebarItem title={item.title} path={item.path} icon={item.icon}>
								{item.children}
							</SidebarItem>
						</li>
					))}
				</ul>
			</div>
			<div className="flex flex-col justify-end bg-sidebarcolordark">
					<div className="flex flex-row justify-evenly my-4 items-center">
						<div className="flex flex-row items-center justify-between gap-x-2 select-none"> 
						<User/> <p className="text-lg">{decodedToken?.sub || ""}</p>
						</div>
						<div>
							<Link href="/logout" className={buttonVariants({variant: "red"})}>Log ud<LogOut/></Link>
						</div>
					</div>
			</div>
			</div>
				);
};

export default Sidebar;
