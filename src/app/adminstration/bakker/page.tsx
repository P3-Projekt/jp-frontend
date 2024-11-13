'use client';  // markere det som et client component

import React from 'react';

const BakkerPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">BAKKE TYPER</h1>

      {/* Opret en bakke*/}
      <form className="bg-sidebarcolor p-6 rounded-lg shadow-xl mb-8 border">
        <h2 className="text-lg font-semibold mb-6">OPRET EN BAKKE TYPE</h2>
        <div className="flex gap-6 grid grid-cols-3">

          {/*navne felt*/}
          <div className="flex-col">
            <label className="font-semibold">Navn:</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Indsæt navn"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/*bakke længde felt*/}
          <div className="flex-col">
            <label className="font-semibold">Længde:</label>
            <input
              id="length"
              type="number"
              name="length"
              min="0"
              placeholder="Indsæt Længde [cm]"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/*bakke brede felt*/}
          <div className="flex-col">
            <label className="font-semibold">Bredde:</label>
            <input
              id="width"
              type="number"
              name="width"
              min="0"
              placeholder="Indsæt Bredde [cm]"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        {/*submit knap*/}
        <button
          type="submit"
          className="transition w-full py-2 mt-4 text-white font-semibold bg-green-600 rounded-2xl hover:bg-green-700"
        >
          OPRET
        </button>
      </form>

{/*tabel til at vise bakke typer*/}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border">
        <h2 className="text-lg font-semibold mb-6">BAKKE TYPE OVERSIGT</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-600 text-black">
              <th className="p-2 border w-1/3">Bakke navn</th>
              <th className="p-2 border w-1/3">Længde [cm]</th>
              <th className="p-2 border w-1/3">Bredde [cm]</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BakkerPage;
