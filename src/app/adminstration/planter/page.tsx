'use client';

import { useState } from 'react';

const PlanterPage: React.FC = () => {

  //indeholder alt info for formens state
  const [formData, setFormData] = useState({
    navn: '',
    spiring: '',
    groTid: '',
    position: 'Ligegyldigt',
    vanding: [] as number[],
  });

  //opdatere state af formen baseret på bruger indput
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //beregner hvor mange checkbokse der skal laves baseret på groTid
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedVanding = checked
        ? [...prevData.vanding, parseInt(value)]
        : prevData.vanding.filter((day) => day !== parseInt(value));
      return {
        ...prevData,
        vanding: updatedVanding,
      };
    });
  };

  // få værdien af "groTid" som et tal hvis det existere
  const numberOfCheckboxes = parseInt(formData.groTid) || 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">PLANTE SORTER</h1>

      //formen der skal sendes til backend
      <form className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border">
        <h2 className="text-lg font-semibold mb-6">OPRET EN PLANTE TYPE</h2>
        <div>

          {/*navn felt*/}
          <div className="flex gap-2">
            <div className="flex-col w-1/4">
              <label className="font-semibold mb-2">Navn:</label>
              <input
                id="navn"
                type="text"
                name="navn"
                placeholder="Indsæt navn"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/*spirings felt*/}
            <div className="flex-col w-1/4">
              <label className="font-semibold mb-2">Spirings tid:</label>
              <input
                id="spiring"
                type="number"
                name="spiring"
                min="0"
                placeholder="Indsæt spirings tid [dage]"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

          {  /*gro tids felt*/}
            <div className="flex-col w-1/4">
              <label className="font-semibold mb-2">Gro tid:</label>
              <input
                id="groTid"
                type="number"
                name="groTid"
                value={formData.groTid}
                onChange={handleInputChange}
                min="0"
                placeholder="Indsæt gro tid [dage]"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/*Positions felt*/}
            <div className="flex-col w-1/4">
              <label className="font-semibold mb-2">Position:</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded"
              >
                <option value="Mellem">Ligegyldigt</option>
                <option value="Nederst">Nederst</option>
                <option value="Øverst">Øverst</option>
              </select>
            </div>
          </div>

          {/*Vandings skema check bokser*/}
          <div className="mt-6">
            <h3 className="font-semibold">Vandings skema:</h3>
            <div className="flex justify-evenly items-center gap-10 mt-2 border-2 border-black bg-white mb-2 h-20">
              {[...Array(numberOfCheckboxes)].map((_, day) => ( //dynamisk visning af vandings skema bokse
                <label key={day} className="flex flex-col items-center -mt-2">
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

          {/* submit knap */}
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white font-semibold bg-green-600 rounded-2xl hover:bg-green-700 transition"
          >
            OPRET
          </button>
        </div>
      </form>

      {/*tabel med oversigt over typer af planter*/}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-semibold mb-6">PLANTE TYPE OVERSIGT</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-600 text-black">
              <th className="p-2 border w-1/4">Sort navn</th>
              <th className="p-2 border w-1/4">Spiring [timer]</th>
              <th className="p-2 border w-1/4">Gro tid [dage]</th>
              <th className="p-2 border w-1/4">Vandings tider [dag(e)]</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanterPage;
