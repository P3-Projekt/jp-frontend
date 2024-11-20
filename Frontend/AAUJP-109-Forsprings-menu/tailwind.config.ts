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
				colorprimary: "#2d5446",
				colorsecondary: "#d2cfc9",
				textcolor: "#3a3c47",
				sidebarcolor: "#F4F3F0",
				subbordercolor: "#E6E3DC",
			},
		},
	},
	plugins: [],
};
export default config;
