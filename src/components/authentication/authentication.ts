"use client";
import { JwtPayload, jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string): boolean => {
	try {
		const decoded = jwtDecode<JwtPayload>(token);
		if (!decoded.exp) {
			console.warn("Token does not have an expiration time.");
			return true; // Consider invalid tokens as expired
		}
		const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
		return decoded.exp < currentTime;
	} catch (error) {
		console.error("Error decoding token:", error);
		return true; // Treat invalid tokens as expired
	}
};

function getToken() {
	if (typeof window !== "undefined") {
		// Check if we are in the browser
		const token = localStorage.getItem("authToken");
		if (!token) {
			window.location.href = "/login";
		} else if (isTokenExpired(token)) {
			localStorage.removeItem("authToken");
			window.location.href = "/login";
		} else {
			return token;
		}
	}
}

export function getUser() {
	const token = getToken();
	if (token) {
		return jwtDecode<JwtPayload>(token).sub;
	}
}

// Define a helper function to make API calls with Bearer token
export function fetchWithAuth(
	url: string,
	options: RequestInit = {},
): Promise<Response> {
	if (typeof window !== "undefined") {
		// Check if we are in the browser
		// Set the default headers with Bearer token
		const headers = {
			Authorization: `Bearer ${getToken()}`, // Bearer token
			...options.headers, // Merge any additional headers passed in options
		};

		// Perform the fetchWithAuth call with the provided URL and options
		return fetch(url, {
			...options, // Spread the passed options (method, body, etc.)
			headers, // Override headers with our Bearer token
		});
	} else {
		throw new Error("fetchWithAuth is not supported outside the browser.");
	}
}
