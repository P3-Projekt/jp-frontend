import { Grid2X2, House, Leaf, SquarePen, Shrub } from "lucide-react";

export const endpoint = process.env.NEXT_PUBLIC_API_URL;

interface SidebarItem {
	title: string;
	path?: string;
	icon?: React.FC;
	children?: SidebarItem[];
}

const sidebarConfig: SidebarItem[] = [
	{
		title: "Hjem",
		path: "/",
		icon: House,
	},
	{
		title: "Adminstration",
		icon: Leaf,
		children: [
			{
				title: "Planter",
				path: "/adminstration/planter",
			},
			{
				title: "Bakker",
				path: "/adminstration/bakker",
			},
			{
				title: "Brugere",
				path: "/adminstration/Brugere",
			},
		],
	},
	{
		title: "Marker",
		path: "/settings",
		icon: Grid2X2,
	},
	{
		title: "Redigeringstilstand",
		path: "/redigeringstilstand",
		icon: SquarePen,
	},
	{
		title: "Forspiring",
		path: "/pregermination",
		icon: Shrub,
	},
];

export default sidebarConfig;
