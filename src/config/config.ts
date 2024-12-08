import { Grid2X2, House, Leaf, SquarePen, Shrub, Calendar } from "lucide-react";

export const endpoint = "http://localhost:8080";

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
		title: "Kalender",
		path: "/kalender",
		icon: Calendar,
	},
	{
		title: "Marker",
		path: "/marker",
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
