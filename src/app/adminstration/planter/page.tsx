'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

//plantetype interface
interface PlantType {
  name: string;
  preGerminationDays: number;
  growthTimeDays: number;
  preferredPosition: 'NoPreferred' | 'Low' | 'High';
  wateringSchedule: number[];
}

//mapping til at konvertere til visning a positioner
const positionDisplayMap = {
  'NoPreferred': 'Ligegyldigt',
  'Low': 'Nederst',
  'High': 'Øverst'
};

const PlanterPage = () => {
  const [planterTyper, setPlanterTyper] = useState<PlantType[]>([]);
  const [formData, setFormData] = useState({
    navn: '',
    spiring: '',
    groTid: '',
    position: 'NoPreferred',
    vanding: [] as number[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hent plantetyper fra backend når der skiftes til siden
  useEffect(() => {
    fetchPlantTypes();
  }, []);

  // function til at hente plantetyper fra backend
  const fetchPlantTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/PlantTypes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunne ikke hente plantetyper fra database');
      }

      const data = await response.json();
      setPlanterTyper(data);

    } catch (error) {
      setError('Kunne ikke hente plante typer fra database');
      console.error('Kunne ikke hente plante typer fra database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Håndtering af ændringer af input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Håndtere checkbox ændringer for vandingskemaet
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const intValue = parseInt(value);
      const updatedVanding = checked
        ? [...prevData.vanding, intValue].sort((a, b) => a - b)
        : prevData.vanding.filter((day) => day !== intValue);
      return {
        ...prevData,
        vanding: updatedVanding,
      };
    });
  };

  // Håndtering af at sende formen til backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // får det der sendes til at matche backend
    const createPlantTypeRequest = {
      name: formData.navn,
      preGerminationDays: parseInt(formData.spiring),
      growthTimeDays: parseInt(formData.groTid),
      preferredPosition: formData.position,
      wateringSchedule: formData.vanding,
    };

    try {
      const response = await fetch('http://localhost:8080/PlantType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPlantTypeRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunne ikke skabe plante type');
      }

      // hent plantetyper fra backend igen
      await fetchPlantTypes();

      // reset af formen
      setFormData({
        navn: '',
        spiring: '',
        groTid: '',
        position: 'NoPreferred',
        vanding: [],
      });
    } catch (err) {
      if(err instanceof Error) {
        if (err.message.includes('already exists')) {
          setError('Plante typen eksistere allerede');
        } else {
          setError('Kunne ikke skabe plante typen');
        }
        console.error('Kunne ikke skabe plante typen:', err);
    }
    } finally {
      setIsLoading(false);
    }
  };

  // håndtere sletning af plantetyper
  const handleDelete = async (plantTypeName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/PlantType/${plantTypeName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunne ikke slette plantetype');
      }

      // henter plante typer fra backend igen så vi har de nyeste data
      await fetchPlantTypes();
    } catch (err) {
      setError('Kunne ikke slette plante typen');
      console.error('Kunne ikke slette plante typen:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">PLANTE SORTER</h1>

      {/*box til at skrive fejlmedelser i hvis der kommer nogen*/}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {/*Form til input af data der skal sendes til backend*/}
      <form
        className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-6">OPRET EN PLANTE TYPE</h2>
        <div className="flex gap-6">

          {/*Navne felt*/}
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

          {/*Spirings felt*/}
          <div className="flex-col w-1/4">
            <label className="font-semibold mb-2">Spiring:</label>
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

          {/*Gro tids felt*/}
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

          {/*Foretrukne positions felt*/}
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

        {/* checkboxe til vandings skema*/}
        <div className="mt-6">
          <h3 className="font-semibold text-center">Vandings skema:</h3>
          <div className="grid grid-cols-7 gap-4 mt-2 border-2 border-black bg-white mb-2 p-4 w-2/5 mx-auto">
            {[...Array(parseInt(formData.groTid) || 0)].map((_, day) => (
              <label key={day} className="flex flex-col items-center">
                <span>Dag {day + 1}</span>
                <input
                  type="checkbox"
                  name="vanding"
                  value={day + 1}
                  checked={formData.vanding.includes(day + 1)}
                  onChange={handleCheckboxChange}
                  className="w-9 h-9 accent-green-600"
                  disabled={isLoading}
                />
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="transition w-full bg-green-700 font-semibold hover:bg-green-800 text-white py-2 mt-4 rounded-2xl"

          disabled={isLoading}
        >
          {isLoading ? 'HENTER DATA FRA BACKEND' : 'OPRET'}
        </button>
      </form>

      {/* Tabel til at se plante typer i database */}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-semibold mb-6">PLANTE TYPE OVERSIGT</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-2 border text-center" style={{ width: '60px' }}>Slet</th>
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
              planterTyper.map((plante) => (
                <tr key={plante.name} className="odd:bg-white even:bg-gray-200">
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(plante.name)}
                      className="flex items-center justify-center w-full h-full"
                      aria-label={`Delete ${plante.name}`}
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
                  <td className="p-2 border text-center">{plante.name}</td>
                  <td className="p-2 border text-center">{plante.preGerminationDays}</td>
                  <td className="p-2 border text-center">{plante.growthTimeDays}</td>
                  <td className="p-2 border text-center">{plante.wateringSchedule.join(', ')}</td>
                  <td className="p-2 border text-center">{positionDisplayMap[plante.preferredPosition]}</td>
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
