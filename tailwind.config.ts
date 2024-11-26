import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				colorprimary: "#2D5446",
				colorsecondary: "#D2CFC9",
				textcolor: "#3A3C47",
				sidebarcolor: "#F4F3F0",
				subbordercolor: "#E6E3DC",
				lightgrey: "#A5A5A5",
				darkgrey: "#D9D9D9"
			},
		},
	},
	plugins: [],
};
export default config;
