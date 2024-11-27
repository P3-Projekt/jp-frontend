'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const BakkerPage = () => {
  const [bakketyper, setBakketyper] = useState([]);
  const [formData, setFormData] = useState({ name: '', lengthCm: '', widthCm: '' });

  // hent data fra backend
  useEffect(() => {
    const fetchBakketyper = async () => {
      try {
        const response = await fetch('http://localhost:8080/TrayTypes');
        const data = await response.json();
        setBakketyper(data);
      } catch (error) {
        console.error('Error fetching bakke typer:', error);
      }
    };

    fetchBakketyper();
  }, []);

  // Send form til backend, reset form felter, og opdater tabel
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/TrayType', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // nulstil formen
        setFormData({ name: '', lengthCm: '', widthCm: '' });
        // hent ny data fra backend
        const updatedResponse = await fetch('http://localhost:8080/TrayTypes');
        const updatedData = await updatedResponse.json();
        setBakketyper(updatedData); //opdater tabel
      } else {
        console.error('Error creating bakke:', await response.text());
      }
    } catch (error) {
      console.error('Error creating bakke:', error);
    }
  };

  // håndter input ændringer
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //slet en bakke
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/TrayType/${id}`,{
        method: 'DELETE',}
      );

      if (response.ok) {
        setBakketyper((prev) => prev.filter((bakke) => bakke.name !== id));
      } else {
        console.error('Error deleting bakke:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting bakke:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">BAKKE TYPER</h1>

      {/* form til at lave en bakketype */}
      <form
        className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-6">OPRET EN BAKKE TYPE</h2>
        <div className="flex gap-6 grid grid-cols-3">
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
            />
          </div>

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
            />
          </div>

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
            />
          </div>
        </div>

        <button
          type="submit"
          className="transition w-full py-2 mt-4 text-white font-semibold bg-green-600 rounded-2xl hover:bg-green-700"
        >
          OPRET
        </button>
      </form>

      {/* tabel til visning af bakke typer fra backend */}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border">
        <h2 className="text-lg font-semibold mb-6">BAKKE TYPE OVERSIGT</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-600 text-black">
              <th className="p-2 border w-1/12">Slet</th> 
              <th className="p-2 border w-1/3">Bakke navn</th>
              <th className="p-2 border w-1/3">Længde [cm]</th>
              <th className="p-2 border w-1/3">Bredde [cm]</th>
            </tr>
          </thead>
          <tbody>
            {bakketyper.map((bakke) => (
              <tr key={bakke.name} className="odd:bg-white even:bg-gray-200">
                <td className="p-2 border text-center">
                  {/* slet knap */}
                  <button
                    onClick={() => handleDelete(bakke.name)}
                    className="flex items-center justify-center w-full h-full"
                    aria-label={`Delete ${bakke.name}`}
                  >
                    <Image
                      src="/Deletes.png"
                      alt="Delete Icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </td>
                <td className="p-2 border">{bakke.name}</td>
                <td className="p-2 border">{bakke.lengthCm}</td>
                <td className="p-2 border">{bakke.widthCm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BakkerPage;
