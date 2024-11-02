"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface SidebarItemProps {
    title: string;
    path?: string;
    icon?: React.FC;
    isChild: boolean;
    children?: SidebarItemProps[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ title, path, icon: Icon, children, isChild }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isParentActive, setIsParentActive] = useState(false);
    const pathname = usePathname();
    const isActive = pathname === path;

    const toggleSubItems = (e: React.MouseEvent) => {
        if (children) {
            setIsOpen(!isOpen);
        }
    };

    useEffect(() => {
        let isActiveChild = false;
        if (children) {
            children.forEach((child) => {
                if (child.path === pathname) {
                    setIsOpen(true);
                    isActiveChild = true;
                }
            });
        }
        setIsParentActive(isActiveChild);
    }, [pathname, children]);

    return (
        <div className={`flex flex-col ${isChild ? "border-l-4 border-subbordercolor" : "mt-8"}`}>
            <div
                className={`p-2.5 rounded ${isActive || isParentActive ?` ${isChild ? "bg-subbordercolor hover:bg-colorsecondary" : "bg-colorprimary text-white"} ` : "hover:bg-colorsecondary"} cursor-pointer flex justify-between items-center text-textcolor transition-all duration-300 ease-in-out`}
                onClick={toggleSubItems}
            >
                {path ? (
                    <Link href={path} className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                        {Icon && <Icon />}
                        <span>{title}</span>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2">
                        {Icon && <Icon />}
                        <span>{title}</span>
                    </div>
                )}
                {children && (
                    <span className={`transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
                        <ChevronDown />
                    </span>
                )}
            </div>
            {isOpen && children && (
                <ul className="pl-4 transition-all duration-300 ease-in-out overflow-hidden">
                    {children.map((child, index) => (
                        <li key={index}>
                            <SidebarItem {...child} isChild={true} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SidebarItem;