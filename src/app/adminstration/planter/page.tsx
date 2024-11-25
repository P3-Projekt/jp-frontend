'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const PlanterPage: React.FC = () => {
  const [planterTyper, setPlanterTyper] = useState([]);
  const [formData, setFormData] = useState({
    navn: '',
    spiring: '',
    groTid: '',
    position: 'Ligegyldigt',
    vanding: [] as number[],
  });

  // hent plantetyper fra backend
  useEffect(() => {
    const fetchPlanterTyper = async () => {
      try {
        const response = await fetch('http://localhost:8080/PlantTypes');
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const data = await response.json();
        setPlanterTyper(data);
      } catch (error) {
        console.error('Error fetching plant types:', error);
      }
    };

    fetchPlanterTyper();
  }, []);

  //Håndter form input ændringer
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Håndter checkbox ændringer (vandings skema)
const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { value, checked } = e.target;
  setFormData((prevData) => {
    const intValue = parseInt(value);
    const updatedVanding = checked
      ? [...prevData.vanding, intValue].sort((a, b) => a - b) // tilføj værdi og sorter array
      : prevData.vanding.filter((day) => day !== intValue); // fjern værdi hvis ikke checked
    return {
      ...prevData,
      vanding: updatedVanding,
    };
  });
};

  // send form til backend, sørger for at tabelen er opdateret, og reset form input felter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8080/PlantType', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.navn,
          preGerminationDays: parseInt(formData.spiring),
          growthTimeDays: parseInt(formData.groTid),
          preferredPosition: formData.position,
          wateringSchedule: formData.vanding,
        }),
      });
  
      if (response.ok) {

        // hent data fra backend
        const updatedResponse = await fetch('http://localhost:8080/PlantTypes');
        if (!updatedResponse.ok) throw new Error(`Failed to fetch updated data: ${updatedResponse.statusText}`);
        const updatedData = await updatedResponse.json();
        setPlanterTyper(updatedData); // opdatere tabel med ny data
  
        // Reset formen
        setFormData({
          navn: '',
          spiring: '',
          groTid: '',
          position: 'Ligegyldigt',
          vanding: [],
        });
      } else {
        console.error(`Error submitting form: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // slet plante type fra backend
  const handleDelete = async (plantTypeName: string) => {
    try {
      const response = await fetch(`/PlantType/${plantTypeName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPlanterTyper((prev) => prev.filter((plante) => plante.name !== plantTypeName));
      } else {
        console.error(`Error deleting plant type: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting plant type:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">PLANTE SORTER</h1>

      <form onSubmit={handleSubmit} className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border">
        <h2 className="text-lg font-semibold mb-6">OPRET EN PLANTE TYPE</h2>
        <div className="flex gap-2">
          <div className="flex-col w-1/4">
            <label className="font-semibold mb-2">Navn:</label>
            <input
              id="navn"
              type="text"
              name="navn"
              value={formData.navn}
              onChange={handleInputChange}
              placeholder="Indsæt navn"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex-col w-1/4">
            <label className="font-semibold mb-2">Spiring:</label>
            <input
              id="spiring"
              type="number"
              name="spiring"
              value={formData.spiring}
              onChange={handleInputChange}
              min="0"
              placeholder="Indsæt spirings tid"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex-col w-1/4">
            <label className="font-semibold mb-2">Gro tid:</label>
            <input
              id="groTid"
              type="number"
              name="groTid"
              value={formData.groTid}
              onChange={handleInputChange}
              min="0"
              placeholder="Indsæt gro tid"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex-col w-1/4">
            <label className="font-semibold mb-2">Position:</label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Ligegyldigt">Ligegyldigt</option>
              <option value="Nederst">Nederst</option>
              <option value="Øverst">Øverst</option>
            </select>
          </div>
        </div>

                  {/* Vandings skema check bokser */}
                  <div className="mt-6">
            <h3 className="font-semibold">Vandings skema:</h3>
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
                  />
                </label>
              ))}
            </div>
          </div>

        <button type="submit" className="w-full py-2 mt-4 bg-green-600 text-white rounded">
          OPRET
        </button>
      </form>

      {/* tabel til at vise plantetyper i database */}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-semibold mb-6">PLANTE TYPE OVERSIGT</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-600 text-black">
              <th className="p-2 border w-1/12">Slet</th> 
              <th className="p-2 border w-1/4">Sort navn</th>
              <th className="p-2 border w-1/4">Spiring [dage]</th>
              <th className="p-2 border w-1/4">Gro tid [dage]</th>
              <th className="p-2 border w-1/4">Vandings tider [dag(e)]</th>
            </tr>
          </thead>
          <tbody>
            {planterTyper.map((plante) => (
              <tr key={plante.name} className="odd:bg-white even:bg-gray-200">
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(plante.name)}
                    className="flex items-center justify-center"
                    aria-label={`Delete ${plante.name}`}
                  >
                    <Image
                      src="/Deletes.png"
                      alt="Delete Icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </td>
                <td className="p-2 border">{plante.name}</td>
                <td className="p-2 border">{plante.preGerminationDays}</td>
                <td className="p-2 border">{plante.growthTimeDays}</td>
                <td className="p-2 border">{plante.wateringSchedule.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanterPage;
