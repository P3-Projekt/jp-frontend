'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface User {
  name: string;
  role: 'Gardener' | 'Administrator' | 'Manager';
  active?: boolean;
}

const BrugereSide = () => {
  const [users, setUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Gardener'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hent brugere til at starte med
  useEffect(() => {
    fetchUsers();
  }, []);

  // funktion til at hente brugere fra backend
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/Users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunne ikke hente brugere fra databasen');
      }
      const data = await response.json();

      // Separer aktive og inaktive brugere
      const activeUsers = data.filter((user: User) => user.active);
      const notActiveUsers = data.filter((user: User) => !user.active);
      setUsers(activeUsers);
      setInactiveUsers(notActiveUsers);

    } catch (err) {
      setError('Kunne ikke hente brugere fra databasen');
      console.error('Kunne ikke hente brugere fra databasen:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Håndtere bruger input ændringer
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // håndtere sendingen af formen så en bruger skabes i backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Kunne ikke skabe brugeren');
      }

      // Genopfrist listen af brugere
      await fetchUsers();

      // nulstil formen
      setFormData({ name: '', role: 'Gardener' });
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        setError('Brugeren eksistere allerede');
      } else {
        setError('Kunne ikke skabe brugeren');
      }
      console.error('Kunne ikke skabe brugeren:', err);
    } finally {
      setIsLoading(false);
    }
  };

  //funktion til reaktivering af brugere
  const handleReactivate = async (name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/Users/${name}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunne ikke reaktivere brugeren');
      }

      //Genopfrist brugertabel
      await fetchUsers();
    } catch (err) {
      setError('Kunne ikke reaktivere brugeren');
      console.error('Kunne ikke reaktivere brugeren:', err);
    } finally {
      setIsLoading(false);
    }
  };

  //funktion til inaktivering af brugere
  const handleDelete = async (name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/Users/${name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Kunne ikke inaktivere brugeren');
      }

      //Genopfrist brugertabel
      await fetchUsers();
    } catch (err) {
      setError('Kunne ikke inaktivere brugeren');
      console.error('Kunne ikke inaktivere brugeren:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">BRUGERE OG ROLLER</h1>

      {/* box til fejlbeskeder i toppen*/}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {/*Form til at lave nye brugere */}
      <form
        className="bg-sidebarcolor p-6 rounded-lg mb-8 shadow-xl border"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-6">OPRET EN BRUGER</h2>
        <div className="grid grid-cols-3 gap-6">

          {/*Navne felt*/}
          <div>
            <label className="font-semibold">Navn:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Indsæt navn"
              className="w-full border border-gray-300 rounded p-2"
              disabled={isLoading}
            />
          </div>

          {/*password felt*/}
          <div>
            <label className="font-semibold">Password:</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Indsæt password"
              className="w-full border border-gray-300 rounded p-2"
              disabled={isLoading}
            />
          </div>

          {/*Rolle felt*/}
          <div>
            <label className="font-semibold">Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-300rounded p-2.5"
              disabled={isLoading}
            >
              <option value="Gardener">Gardener</option>
              <option value="Administrator">Administrator</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
        </div>

        {/*Opret knap*/}
        <button
          type="submit"
          className="transition w-full bg-green-700 font-semibold hover:bg-green-800 text-white py-2 mt-4 rounded-2xl"

          disabled={isLoading}
        >
          {isLoading ? 'HENTER DATA FRA BACKEND' : 'OPRET'}
        </button>
      </form>

      {/*Tabel til at vise aktive brugere*/}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border mb-8">
        <h2 className="text-xl font-semibold mb-6">OVERSIGT OVER AKTIVE BRUGERE</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-2 border text-center" style={{ width: '60px' }}>Inaktiver</th>
              <th className="p-2 border w-1/2">Bruger</th>
              <th className="p-2 border w-1/2">Role</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  Indlæser brugere...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.name} className="odd:bg-white even:bg-gray-200">
                  <td className="p-2 border text-center">
                    {/* Inaktiverings knap */}
                    <button
                      onClick={() => handleDelete(user.name)}
                      className="flex items-center justify-center w-full h-full"
                      aria-label={`Slet ${user.name}`}
                      disabled={isLoading}
                    >
                      <Image
                        src="/User-inactivate.png"
                        alt="Inaktiverings Icon"
                        width={24}
                        height={24}
                      />
                    </button>
                  </td>
                  <td className="p-2 border text-center">{user.name}</td>
                  <td className="p-2 border text-center">{user.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/*Tabel til at vise inaktive brugere*/}
      <div className="bg-sidebarcolor p-6 rounded-lg shadow-xl border">
        <h2 className="text-xl font-semibold mb-6">OVERSIGT OVER INAKTIVE BRUGERE</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-red-700 text-white">
              <th className="p-2 border text-center" style={{ width: '60px' }}>Aktiver</th>
              <th className="p-2 border w-1/2">Bruger</th>
              <th className="p-2 border w-1/2">Role</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  Indlæser brugere...
                </td>
              </tr>
            ) : (
              inactiveUsers.map((user) => (
                <tr key={user.name} className="odd:bg-white even:bg-gray-200">
                  <td className="p-2 border text-center">
                    {/* Reaktiverings knap */}
                    <button
                      onClick={() => handleReactivate(user.name)}
                      className="flex items-center justify-center w-full h-full"
                      aria-label={`Aktiver ${user.name}`}
                      disabled={isLoading}
                    >
                      <Image
                        src="/User-activate.png"
                        alt="Aktiver Icon"
                        width={24}
                        height={24}
                      />
                    </button>
                  </td>
                  <td className="p-2 border text-center">{user.name}</td>
                  <td className="p-2 border text-center">{user.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrugereSide;