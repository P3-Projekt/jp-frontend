'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const BrugereSide: React.FC = () => {
  const [brugere, setBrugere] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: 'Gardener' });

  // hent data fra backend
  useEffect(() => {
    const fetchBrugere = async () => {
      try {
        const response = await fetch('http://localhost:8080/Users');
        if (response.ok) {
          const data: User[] = await response.json();
          setBrugere(data);
        } else {
          console.error('Failed to fetch users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching brugere:', error);
      }
    };
    fetchBrugere();
  }, []);

  // Updater formen baseret på bruger input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

// Send form til backend
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8080/User', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // hent alle brugere fra backend
      const updatedResponse = await fetch('http://localhost:8080/Users');
      if (!updatedResponse.ok) throw new Error(`Failed to fetch updated users: ${updatedResponse.statusText}`);
      const updatedData = await updatedResponse.json();
      setBrugere(updatedData); // Updater tabel med brugere

      // Reset formen
      setFormData({ name: '', role: 'Gardener' });
    } else {
      console.error('Error submitting form:', response.statusText);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

  // Slet en bruger
  const handleDelete = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:8080/Users/${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBrugere((prev) => prev.filter((bruger) => bruger.name !== name)); // Update state
      } else {
        console.error('Error deleting bruger:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting bruger:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">BRUGERE OG ROLLER</h1>

      {/* Form til at sende data */}
      <form
        className="bg-sidebarcolor p-6 rounded-lg mb-8 shadow-xl border"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-6">OPRET EN BRUGER</h2>
        <div className="grid grid-cols-2 gap-6">

          {/* Navne felt */}
          <div>
            <label className="font-semibold">Navn:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Indsæt navn"
              className="w-full border rounded p-2"
            />
          </div>

          {/* Role felt */}
          <div>
            <label className="font-semibold">Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full border rounded p-2.5"
            >
              <option value="Gardener">Gardener</option>
              <option value="Administrator">Administrator</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
        </div>

        {/* Submit knap */}
        <button
          type="submit"
          className="transition w-full bg-green-600 font-semibold hover:bg-green-700 text-white py-2 mt-4 rounded-2xl"
        >
          OPRET
        </button>
      </form>

      {/* Tabel til at rapportere hvilke brugere der er i databasen*/}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border">
        <h2 className="text-xl font-semibold mb-6">BRUGER OVERSIGT</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-600">
              <th className="p-2 border w-1/12">Slet</th> 
              <th className="p-2 border w-1/2">Bruger</th>
              <th className="p-2 border w-1/2">Role</th>
            </tr>
          </thead>
          <tbody>
            {brugere.map((bruger) => (
              <tr key={bruger.name} className="odd:bg-white even:bg-gray-200">
                <td className="p-2 border text-center">
                  {/* Slet knap */}
                  <button
                    onClick={() => handleDelete(bruger.name)}
                    className="flex items-center justify-center"
                    aria-label={`Delete ${bruger.name}`}
                  >
                    <Image
                      src="/deletes.png"
                      alt="Delete Icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </td>
                <td className="p-2 border">{bruger.name}</td>
                <td className="p-2 border">{bruger.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrugereSide;
