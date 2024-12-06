"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/components/authentication/authentication";

// Definition af en bakke type med dens egenskaber
type BakkeType = {
	name: string;
	lengthCm: number;
	widthCm: number;
};

const BakkerPage = () => {
	const router = useRouter();
	// State til at gemme listen over bakke typer
	const [bakketyper, setBakketyper] = useState<BakkeType[]>([]);

	// State til formular data for oprettelse af ny bakke type
	const [formData, setFormData] = useState<BakkeType>({
		name: "",
		lengthCm: 0,
		widthCm: 0,
	});

	// State til at holde styr på indlæsnings status
	const [isLoading, setIsLoading] = useState(false);

	// State til at gemme eventuelle fejlmeddelelser
	const [error, setError] = useState<string | null>(null);

	// Funktion til at hente bakke typer fra backend
	async function fetchTrayTypes() {
		setIsLoading(true);
		setError(null);
		try {
			// Sender en anmodning til backend for at hente bakke typer
			const response = await fetchWithAuth("http://localhost:8080/TrayTypes", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			// Håndterer fejl ved hentning af data
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					errorText || "Kunne ikke hente bakke typer fra databasen",
				);
			}

			// Gemmer de hentede bakke typer i state
			const data = await response.json();
			setBakketyper(data);
		} catch (err) {
			// Håndterer fejl og viser fejlmeddelelse
			setError("Kunne ikke hente bakke typer fra databasen");
			console.error("Fejl ved hentning af bakke typer:", err);

			// Omdirigerer til login-side hvis der mangler autentifikationstoken
			if (
				err instanceof Error &&
				err.message === "No authentication token found"
			) {
				router.push("/login");
			}
		} finally {
			// Afslutter indlæsnings-staten
			setIsLoading(false);
		}
	}

	fetchTrayTypes();

	// Håndterer ændringer i formular-felter
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			// Konverterer numeriske felter til tal, mens tekst-felter forbliver uændrede
			[name]: name === "name" ? value : +value,
		}));
	};

	// Håndterer indsendelse af ny bakke type
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Sender en anmodning til backend for at oprette ny bakke type
			const response = await fetchWithAuth("http://localhost:8080/TrayType", {
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

			// Genindlæser listen over bakke typer
			await fetchTrayTypes();
			// Nulstiller formular-felterne
			setFormData({ name: "", lengthCm: 0, widthCm: 0 });
		} catch (err) {
			if (err instanceof Error && err.message.includes("already exists")) {
				setError("Bakke typen eksisterer allerede");
			} else {
				setError("Kunne ikke skabe bakke typen");
			}
			console.error("Fejl ved oprettelse af bakke type:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Funktion til at slette en bakke type
	const handleDelete = async (name: string) => {
		setIsLoading(true);
		setError(null);

		try {
			// Sender en anmodning til backend for at slette en bakke type
			const response = await fetchWithAuth(
				`http://localhost:8080/TrayType/${name}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			// Håndterer fejl ved sletning
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke slette bakke typen");
			}

			// Genindlæser listen over bakke typer
			await fetchTrayTypes();
		} catch (err) {
			setError("Kunne ikke slette bakke typen");
			console.error("Fejl ved sletning af bakke type:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-8">
			{/* Sidens overskrift */}
			<h1 className="text-3xl font-bold mb-6 text-center">BAKKE TYPER</h1>

			{/* Fejlmeddelelse vises, hvis der er en */}
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					{error}
				</div>
			)}

			{/* Formular til oprettelse af nye bakke typer */}
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

					{/* Input felt for bakke type længde */}
					<div className="flex-col">
						<label className="font-semibold">Længde:</label>
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

					{/* Input felt for bakke type bredde */}
					<div className="flex-col">
						<label className="font-semibold">Bredde:</label>
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

				{/* Knap til at indsende ny bakke type */}
				<button
					type="submit"
					className="transition w-full bg-colorprimary font-semibold hover:bg-green-700 text-white py-2 mt-4 rounded-2xl"
					disabled={isLoading}
				>
					{isLoading ? "HENTER DATA FRA BACKEND" : "OPRET BAKKE TYPE"}
				</button>
			</form>

			{/* Tabel til visning af eksisterende bakke typer */}
			<div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border mb-8">
				<h2 className="text-lg font-semibold mb-6">BAKKE TYPE OVERSIGT</h2>
				<table className="w-full table-auto border-collapse">
					<thead>
						<tr className="bg-colorprimary text-white">
							<th className="p-2 border text-center" style={{ width: "60px" }}>
								Slet
							</th>
							<th className="p-2 border w-1/3">Bakke navn</th>
							<th className="p-2 border w-1/3">Længde [cm]</th>
							<th className="p-2 border w-1/3">Bredde [cm]</th>
						</tr>
					</thead>
					<tbody>
						{/* Indlæsnings-tilstand */}
						{isLoading ? (
							<tr>
								<td colSpan={4} className="text-center py-4">
									Indlæser bakke typer...
								</td>
							</tr>
						) : (
							// Viser eksisterende bakke typer i tabel
							bakketyper.map((bakke) => (
								<tr key={bakke.name} className="odd:bg-white even:bg-gray-200">
									{/* Slet-knap for hver bakke type */}
									<td className="p-2 border text-center">
										<button
											onClick={() => handleDelete(bakke.name)}
											className="flex items-center justify-center w-full h-full"
											aria-label={`Delete ${bakke.name}`}
											disabled={isLoading}
										>
											<Image
												src="/Deletes.png"
												alt="Delete Icon"
												width={24}
												height={24}
											/>
										</button>
									</td>
									{/* Detaljer for hver bakke type */}
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
