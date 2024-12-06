'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/components/authentication/authentication";

// Definerer interface til bakke type data
type BakkeType = {
  name: string;    
  lengthCm: number; 
  widthCm: number;  
};

const BakkerPage = () => {
  const router = useRouter();
  const [bakketyper, setBakketyper] = useState<BakkeType[]>([]); // Liste over bakke typer hentet fra backend
  const [formData, setFormData] = useState<BakkeType>({ // Formular data for at oprette ny bakke type
    name: '',
    lengthCm: 0,
    widthCm: 0,
  });
  const [isLoading, setIsLoading] = useState(false); // Indikator for dataindlæsning
  const [error, setError] = useState<string | null>(null); // Fejlbeskeder til brugeren

  // Hent bakke typer fra backend når siden loades første gang
  useEffect(() => {
    fetchTrayTypes();
  }, []);

  // Funktion til at hente bakke typer fra backend
  const fetchTrayTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth("http://localhost:8080/TrayTypes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Kunne ikke hente bakke typer fra databasen");
      }

      const data = await response.json();
      setBakketyper(data); // Opdater liste over bakke typer
    } catch (err) {
      setError("Kunne ikke hente bakke typer fra databasen");
      console.error("Fejl ved hentning af bakke typer:", err);

      if (err instanceof Error && err.message === 'No authentication token found') {
        router.push('/login'); // Naviger til login hvis token mangler
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Håndter ændringer i formular felter
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : +value, // Konverter numeriske felter
    }));
  };

  // Håndter formular indsendelse for at oprette ny bakke type
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth('http://localhost:8080/TrayType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunne ikke skabe bakke typen');
      }

      await fetchTrayTypes(); // Opdater liste efter oprettelse
      setFormData({ name: '', lengthCm: 0, widthCm: 0 }); // Nulstil formular
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        setError('Bakke typen eksisterer allerede');
      } else {
        setError('Kunne ikke skabe bakke typen');
      }
      console.error('Fejl ved oprettelse af bakke type:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Funktion til at slette en bakke type
  const handleDelete = async (name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`http://localhost:8080/TrayType/${name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunne ikke slette bakke typen');
      }

      await fetchTrayTypes(); // Opdater liste efter sletning
    } catch (err) {
      setError('Kunne ikke slette bakke typen');
      console.error('Fejl ved sletning af bakke type:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">BAKKE TYPER</h1>

      {/* Fejlmeddelelse øverst på siden */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Formular til oprettelse af nye bakke typer */}
      <form
        className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-6">OPRET EN BAKKE TYPE</h2>
        <div className="flex gap-6 grid grid-cols-3">

          {/* Navne felt */}
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

          {/* Længde felt */}
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

          {/* Bredde felt */}
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

        {/* Knap til oprettelse */}
        <button
          type="submit"
          className="transition w-full bg-green-700 font-semibold hover:bg-green-800 text-white py-2 mt-4 rounded-2xl"
          disabled={isLoading}
        >
          {isLoading ? 'HENTER DATA FRA BACKEND' : 'OPRET BAKKE TYPE'}
        </button>
      </form>

      {/* Tabel til visning af bakke typer */}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border mb-8">
        <h2 className="text-lg font-semibold mb-6">BAKKE TYPE OVERSIGT</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-2 border text-center" style={{ width: '60px' }}>Slet</th>
              <th className="p-2 border w-1/3">Bakke navn</th>
              <th className="p-2 border w-1/3">Længde [cm]</th>
              <th className="p-2 border w-1/3">Bredde [cm]</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">Indlæser bakke typer...</td>
              </tr>
            ) : (
              bakketyper.map((bakke) => (
                <tr key={bakke.name} className="odd:bg-white even:bg-gray-200">
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
