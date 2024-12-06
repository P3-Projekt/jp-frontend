"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchWithAuth } from "@/components/authentication/authentication";

// Brugergrænseflade som definerer brugerens struktur
interface User {
	name: string;
	role: "Gardener" | "Administrator" | "Manager";
	active?: boolean;
}

const BrugereSide = () => {
	// Tilstandsvariabler til at styre komponentens data og UI
	const [users, setUsers] = useState<User[]>([]);
	const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);

	// Formular data til oprettelse af ny bruger
	const [formData, setFormData] = useState({
		name: "",
		password: "",
		role: "Gardener",
	});

	// Indlæsnings- og fejlhåndteringstilstande
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Hent brugere når siden indlæses
	useEffect(() => {
		fetchUsers();
	}, []);

	// Funktion til at hente brugere fra backend
	const fetchUsers = async () => {
		setIsLoading(true);
		setError(null);
		try {
			// Send anmodning for at hente brugere
			const response = await fetchWithAuth("http://localhost:8080/Users", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			// Håndter fejl ved hentning af brugere
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke hente brugere fra databasen");
			}
			const data = await response.json();

			// Opdel brugere i aktive og inaktive
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

	// Håndter ændringer i formularfelter
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Håndter indsendelse af formular for at oprette en ny bruger
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Send anmodning for at oprette bruger
			const response = await fetchWithAuth("http://localhost:8080/User", {
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

			// Håndter fejl ved oprettelse af bruger
			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "Kunne ikke skabe brugeren");
			}

			// Genopfrisk brugerlisten
			await fetchUsers();

			// Nulstil formularen
			setFormData({ name: "", password: "", role: "Gardener" });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);     
      if (errorMessage.includes("already exists")) {
          setError("Brugeren eksistere allerede");
      } else {
          setError("Kunne ikke skabe brugeren");
      }
      console.error("Kunne ikke skabe brugeren:", err);
  } finally {
      setIsLoading(false);
  }
};

	// Funktion til reaktivering af en inaktiv bruger
	const handleReactivate = async (name: string) => {
		setIsLoading(true);
		setError(null);

		try {
			// Send anmodning for at reaktivere bruger
			const response = await fetchWithAuth(
				`http://localhost:8080/Users/${name}/activate`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			// Håndter fejl ved reaktivering
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke reaktivere brugeren");
			}

			// Genopfrisk brugerlisten
			await fetchUsers();
		} catch (err) {
			setError("Kunne ikke reaktivere brugeren");
			console.error("Kunne ikke reaktivere brugeren:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Funktion til inaktivering af en aktiv bruger
	const handleDelete = async (name: string) => {
		setIsLoading(true);
		setError(null);

		try {
			// Send anmodning for at inaktivere bruger
			const response = await fetchWithAuth(
				`http://localhost:8080/Users/${name}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			// Håndter fejl ved inaktivering
			if (!response.ok) {
				throw new Error("Kunne ikke inaktivere brugeren");
			}

			// Genopfrisk brugerlisten
			await fetchUsers();
		} catch (err) {
			setError("Kunne ikke inaktivere brugeren");
			console.error("Kunne ikke inaktivere brugeren:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6 text-center">BRUGERE OG ROLLER</h1>

			{/* Fejlbesked boks */}
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					{error}
				</div>
			)}

			{/* Formular til oprettelse af nye brugere */}
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

					{/* Password felt */}
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

					{/* Rolle felt */}
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

				{/* Opret bruger knap */}
				<button
					type="submit"
					className="transition w-full bg-colorprimary font-semibold hover:bg-green-700 text-white py-2 mt-4 rounded-2xl"
					disabled={isLoading}
				>
					{isLoading ? "HENTER DATA FRA DATABASEN" : "OPRET BRUGER"}
				</button>
			</form>

			{/* Tabel over aktive brugere */}
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
										{/* Inaktiverings knap */}
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

			{/* Tabel over inaktive brugere */}
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
										{/* Reaktiverings knap */}
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
