"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Login form component.
 * @returns {JSX.Element} The login form.
 */
function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	// Handle the form submission
	const handleLogin = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		// Send the login request to the server
		try {
			const response = await fetch("http://localhost:8080/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				const data = await response.text();
				console.log("Login successful");
				console.log(data);
				localStorage.setItem("authToken", data);
				router.push("/");
			} else {
				throw new Error("Login fejlede");
			}
		} catch (error) {
			setErrorMessage("Login fejlede. Prøv igen.");
			console.error("Login failed", error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-colorprimary fixed inset-0 z-10">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
				<div className="w-full flex justify-center mb-4">
					<Image src="/logo.png" alt="Logo" width={300} height={100} />
				</div>
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
				<form onSubmit={handleLogin}>
					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2">
							Brugernavn
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2">
							Kodeord
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>
					{errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
					<button
						type="submit"
						className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
}

export default LoginForm;
