"use client";
import React from "react";
import SidebarItem from "./SidebarItem";
import sidebarConfig from "@/config/sidebar";
import Image from "next/image";
import Link from "next/link";

const Sidebar: React.FC = () => {
	return (
		<div className="flex justify-start w-[350px]">
			<div className="sidebar bg-sidebarcolor p-8 w-full">
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
		</div>
	);
};

export default Sidebar;
