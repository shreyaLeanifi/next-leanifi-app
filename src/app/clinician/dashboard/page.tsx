'use client';

import { useEffect, useState } from 'react';
import { Users, Syringe, AlertTriangle } from 'lucide-react';

interface Patient {
  id: string;
  leanifiId: string;
  name: string;
  age?: number;
  gender?: string;
  weight?: number;
  treatmentStartDate?: string;
  isActive: boolean;
}

export default function ClinicianDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('/api/clinician/patients');
        if (resp.ok) {
          const data = await resp.json();
          setPatients(data.patients || []);
        } else {
          setPatients([]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-[#014446]">Clinician Dashboard</h1>
            <button onClick={() => { fetch('/api/auth/logout', { method: 'POST' }); location.href='/login'; }} className="text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg"><Users className="w-6 h-6 text-white"/></div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Assigned Patients</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : patients.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="p-3 bg-green-500 rounded-lg"><Syringe className="w-6 h-6 text-white"/></div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Doses Logged Today</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg"><AlertTriangle className="w-6 h-6 text-white"/></div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Follow-ups</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Patients</h2>
            <a href="/clinician/patients" className="text-[#44BC95] hover:text-[#3aa882]">View all</a>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : patients.length === 0 ? (
              <p className="text-gray-500">No patients yet.</p>
            ) : (
              <ul className="divide-y">
                {patients.slice(0,5).map((p) => (
                  <li key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-sm text-gray-600">{p.leanifiId}</p>
                    </div>
                    <a href={`/clinician/patients/${p.id}/log-dose`} className="text-[#44BC95] hover:text-[#3aa882]">Log dose</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}





