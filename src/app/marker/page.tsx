'use client';

import React, { useState, useEffect } from 'react';

// Batch type interface
type BatchType = {
  batchId: number;
  plantName: string;
  trayName: string;
  creationDate: string;
  createdBy: string;
  amount: number;
  harvestDate: string;
};

//batch request type
type CreateBatchRequest = {
  plantType: string;
  trayType: string;
  createdByUsername: string;
  amount: number;
};

const BatchesPage = () => {
  const [batches, setBatches] = useState<BatchType[]>([]);
  const [plantTypes, setPlantTypes] = useState<string[]>([]);
  const [trayTypes, setTrayTypes] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateBatchRequest>({
    plantType: '',
    trayType: '',
    createdByUsername: '',
    amount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // hent batches, plantetyper, og bakke typer ved load a siden
  useEffect(() => {
    fetchBatches();
    fetchPlantTypes();
    fetchTrayTypes();
  }, []);

  // hent batches fra backend
  const fetchBatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/Batches', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunne ikke hente batches fra databasen');
      }

      const data = await response.json();
      setBatches(data);
      console.log('Fetched Data:', data);

    } catch (err) {
      setError('Kunne ikke hente batches fra databasen');
      console.error('Kunne ikke hente batches fra databasen:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // hent plante typer fra backend
  const fetchPlantTypes = async () => {
    try {
      const response = await fetch('http://localhost:8080/PlantTypes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Kunne ikke hente plantetyper');
      }

      const data = await response.json();
      setPlantTypes(data.map((pt: { name: string }) => pt.name));

    } catch (err) {
      console.error('Kunne ikke hente plantetyper:', err);
    }
  };

  // hent traytypes fra backend
  const fetchTrayTypes = async () => {
    try {
      const response = await fetch('http://localhost:8080/TrayTypes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Kunne ikke hente bakketyper');
      }

      const data = await response.json();
      setTrayTypes(data.map((tt: { name: string }) => tt.name));

    } catch (err) {
      console.error('Kunne ikke hente bakketyper:', err);
    }
  };

  // håndtering af ændringer i batch formen
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? +value : value
    }));
  };

  // send batch data til backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/Batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantTypeId: formData.plantTypeId,
          trayTypeId: formData.trayTypeId,
          createdByUsername: formData.createdByUsername,
          amount: formData.amount
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunne ikke oprette batch');
      }

      // Genopfrisk batch liste
      await fetchBatches();

      // Reset formen
      setFormData({
        plantTypeId: '',
        trayTypeId: '',
        createdByUsername: '',
        amount: 0
      });
    } catch (err: any) {
      setError(err.message || 'Kunne ikke oprette batch');
      console.error('Kunne ikke oprette batch:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">BATCHES</h1>

      {/* feljmeddelses boks */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Form til at skabe nyt batch */}
      <form
        className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-6">OPRET EN NY BATCH</h2>
        <div className="grid grid-cols-4 gap-6">

          {/* valg af plante type */}
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
                <option key={plantType} value={plantType}>{plantType}</option>
              ))}
            </select>
          </div>

          {/* Valg af traytype */}
          <div className="flex-col">
            <label className="font-semibold">Bakketype:</label>
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
                <option key={trayType} value={trayType}>{trayType}</option>
              ))}
            </select>
          </div>

          {/* sået af "bruger" */}
          <div className="flex-col">
            <label className="font-semibold">Oprettet af:</label>
            <input
              type="text"
              name="createdByUsername"
              placeholder="Brugernavn"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.createdByUsername}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Antal */}
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

        {/* opret batch knap */}
        <button
          type="submit"
          className="transition w-full bg-green-700 font-semibold hover:bg-green-800 text-white py-2 mt-4 rounded-2xl"
          disabled={isLoading}
        >
          {isLoading ? 'HENTER DATA FRA BACKEND' : 'OPRET BATCH'}
        </button>
      </form>

      {/* Batches Tabel */}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border mb-8">
        <h2 className="text-lg font-semibold mb-6">BATCH OVERSIGT</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-2 border w-1/7">Batch ID</th>
              <th className="p-2 border w-1/7">Oprettet af</th>
              <th className="p-2 border w-1/7">Plantetype</th>
              <th className="p-2 border w-1/7">Bakketype</th>
              <th className="p-2 border w-1/7">Antal marker</th>
              <th className="p-2 border w-1/7">Oprettet den</th>
              <th className="p-2 border w-1/7">Høstdato</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">Indlæser batches...</td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch.batchId} className="odd:bg-white even:bg-gray-200">
                  <td className="p-2 border text-center">{batch.batchId}</td>
                  <td className="p-2 border text-center">{batch.createdBy}</td>
                  <td className="p-2 border text-center">{batch.plantName}</td>
                  <td className="p-2 border text-center">{batch.trayName}</td>
                  <td className="p-2 border text-center">{batch.amount}</td>
                  <td className="p-2 border text-center">{batch.creationDate}</td>
                  <td className="p-2 border text-center">{batch.harvestDate}</td>

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