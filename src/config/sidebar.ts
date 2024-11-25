import { Grid2X2, House, Leaf, SquarePen } from "lucide-react";

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
				title: "Hylder",
				path: "/adminstration/hylder",
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
		path: "/settings",
		icon: SquarePen,
	},
];

export default sidebarConfig;
