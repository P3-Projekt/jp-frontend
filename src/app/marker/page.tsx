"use client";

import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "@/components/authentication/authentication";

// Interface til at definere batch-typen med dens egenskaber
type BatchType = {
	batchId: number;
	plantName: string;
	trayName: string;
	creationDate: string;
	createdBy: string;
	amount: number;
	harvestDate: string;
};

// Interface til at definere strukturen for en ny batch-anmodning
type CreateBatchRequest = {
	plantTypeId: string;
	trayTypeId: string;
	createdByUsername: string;
	amount: number;
};

const BatchesPage = () => {
	// State variabler til at styre komponentens data og tilstand
	const [batches, setBatches] = useState<BatchType[]>([]);
	const [plantTypes, setPlantTypes] = useState<string[]>([]);
	const [trayTypes, setTrayTypes] = useState<string[]>([]);
	const [formData, setFormData] = useState<CreateBatchRequest>({
		plantTypeId: "",
		trayTypeId: "",
		createdByUsername: "",
		amount: 0,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentUser, setCurrentUser] = useState<string>("");

	// Hent indledende data når siden indlæses
	useEffect(() => {
		// Hent brugerens token og brugernavn
		const authToken = localStorage.getItem("authToken");
		if (authToken) {
			const username = extractUsernameFromToken(authToken);
			setCurrentUser(username);
		}
		// Hent batches, plantetyper og bakketyper
		fetchBatches();
		fetchPlantTypes();
		fetchTrayTypes();
	}, []);

	// Funktion til at uddrage brugernavn fra JWT token
	function extractUsernameFromToken(token: string): string {
		try {
			// Dekoder token for at hente brugeroplysninger
			const base64Url = token.split(".")[1];
			const base64 = base64Url.replace("-", "+").replace("_", "/");
			const payload = JSON.parse(window.atob(base64));
			return payload.sub || payload.username || ""; // Tilpas efter tokenens struktur
		} catch (error) {
			console.error("Fejl ved udtrædning af brugernavn fra token:", error);
			return "";
		}
	}

	// Hent batches fra backend
	const fetchBatches = async () => {
		setIsLoading(true);
		setError(null);
		try {
			// Send anmodning (med token) til backend
			const response = await fetchWithAuth("http://localhost:8080/Batches", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke hente batches fra databasen");
			}

			// Opdater batches state med modtaget data
			const data = await response.json();
			setBatches(data);
			console.log("Hentet Data:", data);
		} catch (err) {
			setError("Kunne ikke hente batches fra databasen");
			console.error("Kunne ikke hente batches fra databasen:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Hent plantetyper fra backend
	const fetchPlantTypes = async () => {
		try {
			// Send anmodning (med token) for at hente plantetyper
			const response = await fetchWithAuth("http://localhost:8080/PlantTypes", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Kunne ikke hente plantetyper");
			}

			// Opdater plantetyper state med navne fra modtaget data
			const data = await response.json();
			setPlantTypes(data.map((pt: { name: string }) => pt.name));
		} catch (err) {
			console.error("Kunne ikke hente plantetyper:", err);
		}
	};

	// Hent bakketyper fra backend
	const fetchTrayTypes = async () => {
		try {
			// Send anmodning (med token) for at hente bakketyper
			const response = await fetchWithAuth("http://localhost:8080/TrayTypes", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Kunne ikke hente bakketyper");
			}

			// Opdater bakketyper state med navne fra modtaget data
			const data = await response.json();
			setTrayTypes(data.map((tt: { name: string }) => tt.name));
		} catch (err) {
			console.error("Kunne ikke hente bakketyper:", err);
		}
	};

	// Håndter ændringer i formularfelter
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		// Opdater formData state, konverter amount til tal hvis nødvendigt
		setFormData((prev) => ({
			...prev,
			[name]: name === "amount" ? +value : value,
		}));
	};

	// Håndter indsendelse af ny batch
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Send anmodning til backend for at oprette ny batch
			const response = await fetchWithAuth("http://localhost:8080/Batch", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plantTypeId: formData.plantTypeId,
					trayTypeId: formData.trayTypeId,
					createdByUsername: currentUser,
					amount: formData.amount,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke oprette batch");
			}

			// Genopfrisk batch-liste efter oprettelse
			await fetchBatches();

			// Nulstil formular
			setFormData({
				plantTypeId: "",
				trayTypeId: "",
				createdByUsername: "",
				amount: 0,
			});
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			setError(errorMessage || "Kunne ikke oprette batch");
			console.error("Kunne ikke oprette batch:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6 text-center">MARKER</h1>

			{/* Fejlmeddelsesboks */}
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					{error}
				</div>
			)}

			{/* Formular til oprettelse af ny batch */}
			<form
				className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border"
				onSubmit={handleSubmit}
			>
				<h2 className="text-lg font-semibold mb-6">
					OPRET EN NY BATCH AF MARKER
				</h2>
				<div className="grid grid-cols-3 gap-6">
					{/* Valg af plantetype */}
					<div className="flex-col">
						<label className="font-semibold">Plantetype:</label>
						<select
							name="plantTypeId"
							className="w-full p-2 border border-gray-300 rounded"
							value={formData.plantTypeId}
							onChange={handleChange}
							required
							disabled={isLoading}
						>
							<option value="">Vælg Plantetype</option>
							{plantTypes.map((plantType) => (
								<option key={plantType} value={plantType}>
									{plantType}
								</option>
							))}
						</select>
					</div>

					{/* Valg af bakketype */}
					<div className="flex-col">
						<label className="font-semibold">Bakke type:</label>
						<select
							name="trayTypeId"
							className="w-full p-2 border border-gray-300 rounded"
							value={formData.trayTypeId}
							onChange={handleChange}
							required
							disabled={isLoading}
						>
							<option value="">Vælg Bakketype</option>
							{trayTypes.map((trayType) => (
								<option key={trayType} value={trayType}>
									{trayType}
								</option>
							))}
						</select>
					</div>

					{/* Antal-input */}
					<div className="flex-col">
						<label className="font-semibold">Antal:</label>
						<input
							type="number"
							name="amount"
							min="1"
							placeholder="Antal planter"
							className="w-full p-2 border border-gray-300 rounded"
							value={formData.amount}
							onChange={handleChange}
							required
							disabled={isLoading}
						/>
					</div>
				</div>

				{/* Knap til oprettelse af batch */}
				<button
					type="submit"
					className="transition w-full bg-colorprimary font-semibold hover:bg-green-700 text-white py-2 mt-4 rounded-2xl"
					disabled={isLoading}
				>
					{isLoading ? "HENTER DATA FRA DATABASEN" : "OPRET BATCH AF MARKER"}
				</button>
			</form>

			{/* Batches tabel */}
			<div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border mb-8">
				<h2 className="text-lg font-semibold mb-6">BATCH OVERSIGT</h2>
				<table className="w-full table-auto border">
					<thead>
						<tr className="bg-colorprimary text-white">
							<th className="p-2 border w-1/7">Batch ID</th>
							<th className="p-2 border w-1/7">Sået af</th>
							<th className="p-2 border w-1/7">Plante type</th>
							<th className="p-2 border w-1/7">Bakke type</th>
							<th className="p-2 border w-1/7">Antal marker</th>
							<th className="p-2 border w-1/7">Sået den</th>
							<th className="p-2 border w-1/7">Høst dato</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={7} className="text-center py-4">
									Indlæser batches...
								</td>
							</tr>
						) : (
							batches
								.slice() // Logik for at sortere i omvendt rækkefølge
								.sort((a, b) => b.batchId - a.batchId)
								.map((batch) => (
									<tr
										key={batch.batchId}
										className="odd:bg-white even:bg-gray-200"
									>
										<td className="p-2 border text-center">{batch.batchId}</td>
										<td className="p-2 border text-center">
											{batch.createdBy}
										</td>
										<td className="p-2 border text-center">
											{batch.plantName}
										</td>
										<td className="p-2 border text-center">{batch.trayName}</td>
										<td className="p-2 border text-center">{batch.amount}</td>
										<td className="p-2 border text-center">
											{batch.creationDate}
										</td>
										<td className="p-2 border text-center">
											{batch.harvestDate}
										</td>
									</tr>
								))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default BatchesPage;
