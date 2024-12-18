"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchWithAuth } from "@/components/authentication/authentication";
import { endpoint } from "@/config/config";

// Interface that defines the structure of a tray object
type BakkeType = {
	name: string;
	lengthCm: number;
	widthCm: number;
	active?: boolean;
};

const BakkerPage = () => {
	// State variables to manage the page's data and UI
	const [bakketyper, setBakketyper] = useState<BakkeType[]>([]);
	const [inactiveBakketyper, setInactiveBakketyper] = useState<BakkeType[]>([]);

	// State to hold form data for creating a new tray type
	const [formData, setFormData] = useState<BakkeType>({
		name: "",
		lengthCm: 0,
		widthCm: 0,
	});

	// State to manage loading and error handling
	const [isLoading, setIsLoading] = useState(false);

	// State to hold error message
	const [error, setError] = useState<string | null>(null);

	// Function to fetch tray types from the data server
	const fetchTrayTypes = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetchWithAuth(endpoint + "/TrayTypes", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					errorText || "Kunne ikke hente bakke typer fra databasen",
				);
			}

			const data = await response.json();

			// Split tray types into active and inactive 
			const activeTrayTypes = data.filter((tray: BakkeType) => tray.active);
			const inactiveTrayTypes = data.filter((tray: BakkeType) => !tray.active);

			setBakketyper(activeTrayTypes);
			setInactiveBakketyper(inactiveTrayTypes);
		} catch (err) {
			setError("Kunne ikke hente bakke typer fra databasen");
			console.error("Fejl ved hentning af bakke typer:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch tray types when the page loads
	useEffect(() => {
		fetchTrayTypes();
	}, []);

	// Handles changes in form fields
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,

			// Converts numerical fields to numbers, while text fields remain unchanged
			[name]: name === "name" ? value : +value,
		}));
	};

	// Handles submission of new tray type
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Send request (with token) to create new tray type
			const response = await fetchWithAuth(endpoint + "/TrayType", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke skabe bakke typen");
			}

			// Resets the form fields
			await fetchTrayTypes();
			// Reset form fields
			setFormData({ name: "", lengthCm: 0, widthCm: 0 });
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			if (errorMessage.includes("already exists")) {
				setError("Bakke typen eksisterer allerede");
			} else {
				setError("Kunne ikke skabe bakke typen");
			}
			console.error("Fejl ved oprettelse af bakke type:", errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to reactivate an inactive tray type
	const handleReactivate = async (name: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetchWithAuth(
				`${endpoint}/TrayType/${name}/activate`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke reaktivere bakke typen");
			}

			await fetchTrayTypes();
		} catch (err) {
			setError("Kunne ikke reaktivere bakke typen");
			console.error("Fejl ved reaktivering af bakke type:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to delete (inactivate) a tray type
	const handleDelete = async (name: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetchWithAuth(
				`${endpoint}/TrayType/${name}/inactivate`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke inaktivere bakke typen");
			}

			await fetchTrayTypes();
		} catch (err) {
			setError("Kunne ikke inaktivere bakke typen. Den er måske i brug");
			console.error("Fejl ved inaktivering af bakke type:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-8 h-screen overflow-y-auto">
			<h1 className="text-3xl font-bold mb-6 text-center">BAKKE TYPER</h1>

			{/* Error message is displayed if there is one */}
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					{error}
				</div>
			)}

			{/* Form for creating new tray types */}
			<form
				className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border"
				onSubmit={handleSubmit}
			>
				<h2 className="text-lg font-semibold mb-6">OPRET EN BAKKE TYPE</h2>
				<div className="gap-6 grid grid-cols-3">
					{/* Input felt for bakke type navn */}
					<div className="flex-col">
						<label className="font-semibold">Navn:</label>
						<input
							id="name"
							type="text"
							name="name"
							placeholder="Indsæt navn"
							className="w-full p-2 border border-gray-300 rounded"
							value={formData.name}
							onChange={handleChange}
							required
							disabled={isLoading}
						/>
					</div>

					{/* The input field for tray type length */}
					<div className="flex-col">
						<label className="font-semibold">Længde [cm]:</label>
						<input
							id="lengthCm"
							type="number"
							name="lengthCm"
							min="0"
							placeholder="Indsæt Længde [cm]"
							className="w-full p-2 border border-gray-300 rounded"
							value={formData.lengthCm}
							onChange={handleChange}
							required
							disabled={isLoading}
						/>
					</div>

					{/* The input field for tray type width */}
					<div className="flex-col">
						<label className="font-semibold">Bredde [cm]:</label>
						<input
							id="widthCm"
							type="number"
							name="widthCm"
							min="0"
							placeholder="Indsæt Bredde [cm]"
							className="w-full p-2 border border-gray-300 rounded"
							value={formData.widthCm}
							onChange={handleChange}
							required
							disabled={isLoading}
						/>
					</div>
				</div>

				{/* Button to submit new tray type */}
				<button
					type="submit"
					className="transition w-full bg-colorprimary font-semibold hover:bg-green-700 text-white py-2 mt-4 rounded-2xl"
					disabled={isLoading}
				>
					{isLoading ? "HENTER DATA FRA DATABASEN" : "OPRET BAKKE TYPE"}
				</button>
			</form>

			{/* Table over active tray types */}
			<div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border mb-8">
				<h2 className="text-lg font-semibold mb-6">
					AKTIV BAKKE TYPE OVERSIGT
				</h2>
				<table className="w-full table-auto border-collapse">
					<thead>
						<tr className="bg-colorprimary text-white">
							<th className="p-2 border text-center" style={{ width: "60px" }}>
								Inaktiver
							</th>
							<th className="p-2 border w-1/3">Bakke navn</th>
							<th className="p-2 border w-1/3">Længde [cm]</th>
							<th className="p-2 border w-1/3">Bredde [cm]</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={4} className="text-center py-4">
									Indlæser bakke typer...
								</td>
							</tr>
						) : (
							bakketyper.map((bakke) => (
								<tr key={bakke.name} className="odd:bg-white even:bg-gray-200">
									<td className="p-2 border text-center">
										<button
											onClick={() => handleDelete(bakke.name)}
											className="flex items-center justify-center w-full h-full"
											aria-label={`Inaktiver ${bakke.name}`}
											disabled={isLoading}
										>
											<Image
												src="/x.png"
												alt="Inaktiver Icon"
												width={24}
												height={24}
											/>
										</button>
									</td>
									<td className="p-2 border text-center">{bakke.name}</td>
									<td className="p-2 border text-center">{bakke.lengthCm}</td>
									<td className="p-2 border text-center">{bakke.widthCm}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Table over inactive tray types */}
			<div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border">
				<h2 className="text-xl font-semibold mb-6">
					INAKTIV BAKKE TYPE OVERSIGT
				</h2>
				<table className="w-full table-auto border-collapse">
					<thead>
						<tr className="bg-red-900 text-white">
							<th className="p-2 border text-center" style={{ width: "60px" }}>
								Aktiver
							</th>
							<th className="p-2 border w-1/3">Bakke navn</th>
							<th className="p-2 border w-1/3">Længde [cm]</th>
							<th className="p-2 border w-1/3">Bredde [cm]</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={4} className="text-center py-4">
									Indlæser bakke typer...
								</td>
							</tr>
						) : (
							inactiveBakketyper.map((bakke) => (
								<tr key={bakke.name} className="odd:bg-white even:bg-gray-200">
									<td className="p-2 border text-center">
										<button
											onClick={() => handleReactivate(bakke.name)}
											className="flex items-center justify-center w-full h-full"
											aria-label={`Aktiver ${bakke.name}`}
											disabled={isLoading}
										>
											<Image
												src="/check.png"
												alt="Aktiver Icon"
												width={24}
												height={24}
											/>
										</button>
									</td>
									<td className="p-2 border text-center">{bakke.name}</td>
									<td className="p-2 border text-center">{bakke.lengthCm}</td>
									<td className="p-2 border text-center">{bakke.widthCm}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default BakkerPage;
