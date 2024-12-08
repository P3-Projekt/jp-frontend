import type { NextConfig } from "next";
import { endpoint } from "@/config/config";

const nextConfig: NextConfig = {
	basePath: "",
	async headers() {
		return [
			{
				source: "/",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: endpoint,
					},
				],
			},
		];
	},
};

export default nextConfig;
