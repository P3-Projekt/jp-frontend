"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchWithAuth } from "@/components/authentication/authentication";
import { endpoint } from "@/config/config";

// Interface that defines the structure of a user object
interface User {
	name: string;
	role: "Gardener" | "Administrator" | "Manager";
	active?: boolean;
}

const BrugereSide = () => {
	// State variables to manage the page's data and UI
	const [users, setUsers] = useState<User[]>([]);
	const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);

	// Form data for creating a new user
	const [formData, setFormData] = useState({
		name: "",
		password: "",
		role: "Gardener",
	});

	// Loading and error handling states
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch users when the page loads
	useEffect(() => {
		fetchUsers();
	}, []);

	// Function to fetch users from the data server
	const fetchUsers = async () => {
		setIsLoading(true);
		setError(null);
		try {
			// Send request (with token) to get users
			const response = await fetchWithAuth(endpoint + "/Users", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			// Handle errors when fetching users
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke hente brugere fra databasen");
			}
			const data = await response.json();

			// Split users into active and inactive
			const activeUsers = data.filter((user: User) => user.active);
			const notActiveUsers = data.filter((user: User) => !user.active);
			setUsers(activeUsers);
			setInactiveUsers(notActiveUsers);
		} catch (err) {
			setError("Kunne ikke hente brugere fra databasen");
			console.error("Kunne ikke hente brugere fra databasen:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle changes in form fields
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Handle submission of form to create a new user
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Send request (with token) to create user
			const response = await fetchWithAuth(endpoint + "/User", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: formData.name,
					password: formData.password,
					role: formData.role,
				}),
			});

			// Handle errors when creating a user
			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "Kunne ikke skabe brugeren");
			}

			// Refresh the user list
			await fetchUsers();

			// Reset the form
			setFormData({ name: "", password: "", role: "Gardener" });
		} catch (err) {
			if (err instanceof Error && err.message.includes("already exists")) {
				setError("Brugeren eksistere allerede");
			} else {
				setError("Kunne ikke skabe brugeren");
			}
			console.error("Kunne ikke skabe brugeren:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to reactivate an inactive user
	const handleReactivate = async (name: string) => {
		setIsLoading(true);
		setError(null);

		try {
			// Send request (with token) to reactivate user
			const response = await fetchWithAuth(
				`${endpoint}/Users/${name}/activate`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			// Handle errors when reactivating a user
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke reaktivere brugeren");
			}

			// Refresh the user list
			await fetchUsers();
		} catch (err) {
			setError("Kunne ikke reaktivere brugeren");
			console.error("Kunne ikke reaktivere brugeren:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to deactivate an active user
	const handleDelete = async (name: string) => {
		setIsLoading(true);
		setError(null);

		try {
			// Send request (with token) to deactivate user
			const response = await fetchWithAuth(`${endpoint}/Users/${name}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});

			// Handle errors when deactivating a user
			if (!response.ok) {
				throw new Error("Kunne ikke inaktivere brugeren");
			}

			// Refresh the user list
			await fetchUsers();
		} catch (err) {
			setError("Kunne ikke inaktivere brugeren");
			console.error("Kunne ikke inaktivere brugeren:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-8 h-screen overflow-y-auto">
			<h1 className="text-3xl font-bold mb-6 text-center">BRUGERE OG ROLLER</h1>

			{/* Error box */}
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					{error}
				</div>
			)}

			{/* Form for creating new users */}
			<form
				className="bg-sidebarcolor p-6 rounded-lg mb-8 shadow-xl border"
				onSubmit={handleSubmit}
			>
				<h2 className="text-lg font-semibold mb-6">OPRET EN BRUGER</h2>
				<div className="grid grid-cols-3 gap-6">
					{/* Navne felt */}
					<div>
						<label className="font-semibold">Navn:</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							placeholder="Indsæt navn"
							className="w-full border border-gray-300 rounded p-2"
							disabled={isLoading}
						/>
					</div>

					{/* Password input */}
					<div>
						<label className="font-semibold">Password:</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							placeholder="Indsæt password"
							className="w-full border border-gray-300 rounded p-2"
							disabled={isLoading}
						/>
					</div>

					{/* Role input */}
					<div>
						<label className="font-semibold">Role:</label>
						<select
							name="role"
							value={formData.role}
							onChange={handleChange}
							required
							className="w-full border border-gray-300rounded p-2.5"
							disabled={isLoading}
						>
							<option value="Gardener">Gardener</option>
							<option value="Administrator">Administrator</option>
							<option value="Manager">Manager</option>
						</select>
					</div>
				</div>

				{/* Create user button*/}
				<button
					type="submit"
					className="transition w-full bg-colorprimary font-semibold hover:bg-green-700 text-white py-2 mt-4 rounded-2xl"
					disabled={isLoading}
				>
					{isLoading ? "HENTER DATA FRA DATABASEN" : "OPRET BRUGER"}
				</button>
			</form>

			{/* Table over active users */}
			<div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border mb-8">
				<h2 className="text-xl font-semibold mb-6">AKTIV BRUGER OVERSIGT</h2>
				<table className="w-full table-auto border-collapse">
					<thead>
						<tr className="bg-colorprimary text-white">
							<th className="p-2 border text-center" style={{ width: "60px" }}>
								Inaktiver
							</th>
							<th className="p-2 border w-1/2">Bruger</th>
							<th className="p-2 border w-1/2">Role</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={3} className="p-4 text-center">
									Indlæser brugere...
								</td>
							</tr>
						) : (
							users.map((user) => (
								<tr key={user.name} className="odd:bg-white even:bg-gray-200">
									<td className="p-2 border text-center">
										{/* Deactivate button */}
										<button
											onClick={() => handleDelete(user.name)}
											className="flex items-center justify-center w-full h-full"
											aria-label={`Slet ${user.name}`}
											disabled={isLoading}
										>
											<Image
												src="/User-inactivate.png"
												alt="Inaktiverings Icon"
												width={24}
												height={24}
											/>
										</button>
									</td>
									<td className="p-2 border text-center">{user.name}</td>
									<td className="p-2 border text-center">{user.role}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Table over inactive users */}
			<div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border">
				<h2 className="text-xl font-semibold mb-6">INAKTIV BRUGER OVERSIGT</h2>
				<table className="w-full table-auto border-collapse">
					<thead>
						<tr className="bg-red-900 text-white">
							<th className="p-2 border text-center" style={{ width: "60px" }}>
								Aktiver
							</th>
							<th className="p-2 border w-1/2">Bruger</th>
							<th className="p-2 border w-1/2">Role</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={3} className="p-4 text-center">
									Indlæser brugere...
								</td>
							</tr>
						) : (
							inactiveUsers.map((user) => (
								<tr key={user.name} className="odd:bg-white even:bg-gray-200">
									<td className="p-2 border text-center">
										{/* Reactivate button */}
										<button
											onClick={() => handleReactivate(user.name)}
											className="flex items-center justify-center w-full h-full"
											aria-label={`Aktiver ${user.name}`}
											disabled={isLoading}
										>
											<Image
												src="/User-activate.png"
												alt="Aktiver Icon"
												width={24}
												height={24}
											/>
										</button>
									</td>
									<td className="p-2 border text-center">{user.name}</td>
									<td className="p-2 border text-center">{user.role}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default BrugereSide;
