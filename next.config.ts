import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	basePath: "",
	async headers() {
        return [
            {
                source: "/",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "http://localhost:8080" },
                ]
            }
        ]
    }
};

export default nextConfig;
