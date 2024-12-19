"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchWithAuth } from "@/components/authentication/authentication";
import { endpoint } from "@/config/config";

// PlantType interface with properties for plant types
interface PlantType {
	name: string;
	preGerminationDays: number;
	growthTimeDays: number;
	preferredPosition: "NoPreferred" | "Low" | "High";
	wateringSchedule: number[];
	active: boolean;
}

// Mapping to translate positions to Danish
const positionDisplayMap = {
	NoPreferred: "Ligegyldigt",
	Low: "Nederst",
	High: "Øverst",
};

const PlanterPage = () => {
	// State variables to manage the page's data and UI
	const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);
	const [inactivePlantTypes, setInactivePlantTypes] = useState<PlantType[]>([]);

	// State variables to manage form data
	const [formData, setFormData] = useState({
		navn: "",
		spiring: "",
		groTid: "",
		position: "NoPreferred",
		vanding: [] as number[],
	});

	// State variables to manage loading and error handling
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch plant types from the data server when the page loads
	useEffect(() => {
		fetchPlantTypes();
	}, []);

	// Function to fetch plant types from the data server
	const fetchPlantTypes = async () => {
		setIsLoading(true);
		setError(null);
		try {
			// Send request to data server to get plant types
			const response = await fetchWithAuth(endpoint + "/PlantTypes", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					errorText || "Kunne ikke hente plantetyper fra database",
				);
			}

			// Parse response data
			const data = await response.json();

			// Set plant types in state
			const activePlantTypes = data.filter(
				(plante: PlantType) => plante.active,
			);
			const inactivePlantTypes = data.filter(
				(plante: PlantType) => !plante.active,
			);

			setPlantTypes(activePlantTypes);
			setInactivePlantTypes(inactivePlantTypes);
		} catch (error) {
			setError("Kunne ikke hente plante typer fra database");
			console.error("Kunne ikke hente plante typer fra database:", error);
		} finally {
			// Set loading state to false
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

	// Handle changes in checkboxes for watering schedule
	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		setFormData((prevData) => {
			const intValue = parseInt(value);
			// Add or remove days from the watering schedule
			const updatedVanding = checked
				? [...prevData.vanding, intValue].sort((a, b) => a - b)
				: prevData.vanding.filter((day) => day !== intValue);
			return {
				...prevData,
				vanding: updatedVanding,
			};
		});
	};

	// Handle submission of form to create a new plant type
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		// Prepare data for backend
		const createPlantTypeRequest = {
			name: formData.navn,
			preGerminationDays: parseInt(formData.spiring),
			growthTimeDays: parseInt(formData.groTid),
			preferredPosition: formData.position,
			wateringSchedule: formData.vanding,
		};

		try {
			// Send request (with token) to create new plant type
			const response = await fetchWithAuth(`${endpoint}/PlantType`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(createPlantTypeRequest),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke skabe plante type");
			}

			// Reload plant types after successful creation
			await fetchPlantTypes();

			// Reset form data
			setFormData({
				navn: "",
				spiring: "",
				groTid: "",
				position: "NoPreferred",
				vanding: [],
			});
		} catch (err) {
			if (err instanceof Error && err.message.includes("already exists")) {
				setError("Plante typen eksistere allerede");
			} else {
				setError("Kunne ikke skabe plante typen");
			}
			console.error("Kunne ikke skabe plante typen:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Send request (with token) to deactivate plant type
	const handleDeactivate = async (name: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetchWithAuth(`${endpoint}/PlantType/${name}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke inaktivere plantetype");
			}

			await fetchPlantTypes();
		} catch (err) {
			setError("Kunne ikke inaktivere plantetype");
			console.error("Kunne ikke inaktivere plantetype:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Send request (with token) to reactivate plant type
	const handleReactivate = async (name: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetchWithAuth(
				`${endpoint}/PlantType/${name}/activate`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Kunne ikke reaktivere plantetype");
			}

			await fetchPlantTypes();
		} catch (err) {
			setError("Kunne ikke reaktivere plantetype");
			console.error("Kunne ikke reaktivere plantetype:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-8 h-screen overflow-y-auto">
			<h1 className="text-3xl font-bold mb-6 text-center">PLANTE SORTER</h1>

			{/* Show error message if there is an error */}
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					{error}
				</div>
			)}

			{/* Form for creating a new plant type */}
			<form
				className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border"
				onSubmit={handleSubmit}
			>
				<h2 className="text-lg font-semibold mb-6">OPRET EN PLANTE TYPE</h2>
				<div className="flex gap-6">
					{/* Name input */}
					<div className="flex-col w-1/4">
						<label className="font-semibold mb-2">Navn:</label>
						<input
							id="navn"
							type="text"
							name="navn"
							value={formData.navn}
							onChange={handleChange}
							placeholder="Indsæt navn"
							className="w-full p-2 border border-gray-300 rounded"
							required
							disabled={isLoading}
						/>
					</div>

					{/* Pre-germination input */}
					<div className="flex-col w-1/4">
						<label className="font-semibold mb-2">Spirings tid:</label>
						<input
							id="spiring"
							type="number"
							name="spiring"
							value={formData.spiring}
							onChange={handleChange}
							min="0"
							placeholder="Indsæt spirings tid"
							className="w-full p-2 border border-gray-300 rounded"
							required
							disabled={isLoading}
						/>
					</div>

					{/* Growth time input */}
					<div className="flex-col w-1/4">
						<label className="font-semibold mb-2">Gro tid:</label>
						<input
							id="groTid"
							type="number"
							name="groTid"
							value={formData.groTid}
							onChange={handleChange}
							min="0"
							placeholder="Indsæt gro tid"
							className="w-full p-2 border border-gray-300 rounded"
							required
							disabled={isLoading}
						/>
					</div>

					{/* Position input */}
					<div className="flex-col w-1/4">
						<label className="font-semibold mb-2">Position:</label>
						<select
							id="position"
							name="position"
							value={formData.position}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							required
							disabled={isLoading}
						>
							<option value="NoPreferred">Ligegyldigt</option>
							<option value="Low">Nederst</option>
							<option value="High">Øverst</option>
						</select>
					</div>
				</div>

				{/* Checkbox for watering schedule */}
				<div className="mt-6">
					<h3 className="font-semibold text-center">Vandings skema:</h3>
					<div className="grid grid-cols-7 gap-4 mt-2 border-2 border-colorprimary bg-white mb-2 p-4 w-2/5 mx-auto">
						{/* Dynamically generate checkboxes based on growth time */}
						{[...Array(parseInt(formData.groTid) || 0)].map((_, day) => (
							<label key={day} className="flex flex-col items-center">
								<span className="text-xs w-11">Dag {day + 1}</span>
								<input
									type="checkbox"
									name="vanding"
									value={day + 1}
									checked={formData.vanding.includes(day + 1)}
									onChange={handleCheckboxChange}
									className="w-11 h-11 accent-green-600"
									disabled={isLoading || parseInt(formData.spiring) > day}
								/>
							</label>
						))}
					</div>
				</div>

				{/* Create button */}
				<button
					type="submit"
					className="transition w-full bg-colorprimary font-semibold hover:bg-green-700 text-white py-2 mt-4 rounded-2xl"
					disabled={isLoading}
				>
					{isLoading ? "HENTER DATA FRA DATABASEN" : "OPRET PLANTE TYPE"}
				</button>
			</form>

			{/* Tabel to display existing plant types */}
			<div className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8">
				<h2 className="text-lg font-semibold mb-6">AKTIVE PLANTE TYPER</h2>
				<table className="w-full table-auto border-collapse">
					<thead>
						<tr className="bg-colorprimary text-white">
							<th className="p-2 border text-center" style={{ width: "60px" }}>
								Inaktiver
							</th>
							<th className="p-2 border w-1/5">Sort navn</th>
							<th className="p-2 border w-1/5">Spiring [dage]</th>
							<th className="p-2 border w-1/5">Gro tid [dage]</th>
							<th className="p-2 border w-1/5">Vandings tider [dage]</th>
							<th className="p-2 border w-1/5">Position</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={6} className="p-4 text-center">
									Indlæser plante typer...
								</td>
							</tr>
						) : (
							plantTypes.map((plante) => (
								<tr key={plante.name} className="odd:bg-white even:bg-gray-200">
									<td className="p-2 border text-center">
										<button
											onClick={() => handleDeactivate(plante.name)}
											className="flex items-center justify-center w-full h-full"
											aria-label={`Inaktiver ${plante.name}`}
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
									<td className="p-2 border text-center">{plante.name}</td>
									<td className="p-2 border text-center">
										{plante.preGerminationDays}
									</td>
									<td className="p-2 border text-center">
										{plante.growthTimeDays}
									</td>
									<td className="p-2 border text-center">
										{plante.wateringSchedule.join(", ")}
									</td>
									<td className="p-2 border text-center">
										{positionDisplayMap[plante.preferredPosition]}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Inactive Plant Types Table */}
			<div className="bg-sidebarcolor p-6 rounded-lg shadow-xl">
				<h2 className="text-lg font-semibold mb-6">INAKTIVE PLANTE TYPER</h2>
				<table className="w-full table-auto border-collapse">
					<thead>
						<tr className="bg-red-900 text-white">
							<th className="p-2 border text-center" style={{ width: "60px" }}>
								Aktiver
							</th>
							<th className="p-2 border w-1/5">Sort navn</th>
							<th className="p-2 border w-1/5">Spiring [dage]</th>
							<th className="p-2 border w-1/5">Gro tid [dage]</th>
							<th className="p-2 border w-1/5">Vandings tider [dage]</th>
							<th className="p-2 border w-1/5">Position</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={6} className="p-4 text-center">
									Indlæser plante typer...
								</td>
							</tr>
						) : (
							inactivePlantTypes.map((plante) => (
								<tr key={plante.name} className="odd:bg-white even:bg-gray-200">
									<td className="p-2 border text-center">
										<button
											onClick={() => handleReactivate(plante.name)}
											className="flex items-center justify-center w-full h-full"
											aria-label={`Aktiver ${plante.name}`}
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
									<td className="p-2 border text-center">{plante.name}</td>
									<td className="p-2 border text-center">
										{plante.preGerminationDays}
									</td>
									<td className="p-2 border text-center">
										{plante.growthTimeDays}
									</td>
									<td className="p-2 border text-center">
										{plante.wateringSchedule.join(", ")}
									</td>
									<td className="p-2 border text-center">
										{positionDisplayMap[plante.preferredPosition]}
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

export default PlanterPage;
