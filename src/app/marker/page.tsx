"use client";

import React, { useState, useEffect } from "react";
import {
	fetchWithAuth,
	getUser,
} from "@/components/authentication/authentication";
import { endpoint } from "@/config/config";

// Interface to define the batch type with its properties
type BatchType = {
	batchId: number;
	plantName: string;
	trayName: string;
	creationDate: string;
	createdBy: string;
	amount: number;
	harvestDate: string;
};

// Interface to define the structure of a new batch request
type CreateBatchRequest = {
	plantTypeId: string;
	trayTypeId: string;
	createdByUsername: string;
	amount: number;
};

const BatchesPage = () => {
	// State variables to manage the component's data and state
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

	// Retrieve initial data when the page loads
	useEffect(() => {
		// Get the user's token and username
		const username = getUser();
		if (username) {
			setCurrentUser(username);
		}
		// Retrieve batches, plant types, and tray types
		fetchBatches();
		fetchPlantTypes();
		fetchTrayTypes();
	}, []);

	// Fetch batches from the backend
	const fetchBatches = async () => {
		setIsLoading(true);
		setError(null);
		try {
			// Send request (with token) to get batches
			const response = await fetchWithAuth(endpoint + "/Batches", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke hente batches fra databasen");
			}

			// Update batches state with data from the response
			const data = await response.json();
			setBatches(data);
		} catch (err) {
			setError("Kunne ikke hente batches fra databasen");
			console.error("Kunne ikke hente batches fra databasen:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch plant types from the backend
	const fetchPlantTypes = async () => {
		try {
			// Send request (with token) to get plant types
			const response = await fetchWithAuth(endpoint + "/PlantTypes", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Kunne ikke hente plantetyper");
			}

			// Update plant types state with names from the received data
			const data = await response.json();
			const activePlantTypes = data.filter(
				(pt: { name: string; active: boolean }) => pt.active,
			);
			setPlantTypes(activePlantTypes.map((pt: { name: string }) => pt.name));
		} catch (err) {
			console.error("Kunne ikke hente plantetyper:", err);
		}
	};

	// Fetch tray types from the backend
	const fetchTrayTypes = async () => {
		try {
			// Send request (with token) to get tray types
			const response = await fetchWithAuth(endpoint + "/TrayTypes", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Kunne ikke hente bakketyper");
			}

			// Update tray types state with names from the received data
			const data = await response.json();
			const activeTrays = data.filter(
				(tt: { name: string; active: boolean }) => tt.active,
			);
			setTrayTypes(activeTrays.map((tt: { name: string }) => tt.name));
		} catch (err) {
			console.error("Kunne ikke hente bakketyper:", err);
		}
	};

	// Handle changes in form fields
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		// Update the formData state, convert amount to a number if necessary
		setFormData((prev) => ({
			...prev,
			[name]: name === "amount" ? +value : value,
		}));
	};

	// Handle submission of form to create a new batch
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Send request (with token) to create a new batch
			const response = await fetchWithAuth(endpoint + "/Batch", {
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

			// Reload batch list after creation
			await fetchBatches();

			// Reset form data
			setFormData({
				plantTypeId: "",
				trayTypeId: "",
				createdByUsername: "",
				amount: 0,
			});
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			setError(errorMessage || "Kunne ikke oprette batch");
			console.error("Kunne ikke oprette batch:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-8 h-screen overflow-y-auto">
			<h1 className="text-3xl font-bold mb-6 text-center">MARKER</h1>

			{/* Show error message if an error occurred */}
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					{error}
				</div>
			)}

			{/* Form for creating a new batch */}
			<form
				className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border"
				onSubmit={handleSubmit}
			>
				<h2 className="text-lg font-semibold mb-6">
					OPRET EN NY BATCH AF MARKER
				</h2>
				<div className="grid grid-cols-3 gap-6">
					{/* Select a plant type */}
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

					{/* Select af tray type*/}
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

					{/* Select amount */}
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

				{/* Button to create a new batch */}
				<button
					type="submit"
					className="transition w-full bg-colorprimary font-semibold hover:bg-green-700 text-white py-2 mt-4 rounded-2xl"
					disabled={isLoading}
				>
					{isLoading ? "HENTER DATA FRA DATABASEN" : "OPRET BATCH AF MARKER"}
				</button>
			</form>

			{/* Batches table */}
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
								.slice() // Create a copy in opposite order
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
