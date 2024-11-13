'use client';

import React from 'react';

const BrugereSide: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">BRUGERE OG ROLLER</h1>

      {/* Opret en bruger*/}
      <form className="bg-sidebarcolor p-6 rounded-lg mb-8 shadow-xl border">
        <h2 className="text-lg font-semibold mb-6">OPRET EN BRUGER</h2>
        <div className="grid grid-cols-2 gap-6">

          {/* navn felt*/}
          <div>
            <label className="font-semibold">Navn:</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Indsæt navn"
              className="w-full border rounded p-2"
            />
          </div>

          {/* role felt */}
          <div>
            <label className="font-semibold">Role:</label>
            <select
              name="role"
              required
              className="w-full border rounded p-2.5"
            >
              <option>Gardener</option>
              <option>Administrator</option>
              <option>Manager</option>
            </select>
          </div>
        </div>

        {/* submit knap */}
        <button
          type="submit"
          className="transition w-full bg-green-600 font-semibold hover:bg-green-700 text-white font-semibold py-2 mt-4 rounded-2xl"
        >
          OPRET
        </button>
      </form>

      {/* Tabel til overblik over brugere */}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border">
        <h2 className="text-xl font-semibold mb-6">BRUGER OVERSIGT</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className= "bg-green-600">
              <th className="p-2 border w-1/2">Bruger</th>
              <th className="p-2 border w-1/2">Role</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrugereSide;
