'use client';

import { useEffect, useState } from 'react';

interface Patient { id: string; name: string; leanifiId: string; age?: number; gender?: string; weight?: number; treatmentStartDate?: string; }

export default function ClinicianPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('/api/clinician/patients');
        if (resp.ok) {
          const data = await resp.json();
          setPatients(data.patients || []);
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
          <div className="flex items-center py-4">
            <a href="/clinician/dashboard" className="mr-4 text-gray-600 hover:text-gray-900">← Back</a>
            <h1 className="text-2xl font-bold text-[#014446]">Patients</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leanifi ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment Start</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                ) : patients.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No patients</td></tr>
                ) : (
                  patients.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-500">{p.age ? `${p.age} years` : ''} {p.gender ? `• ${p.gender}` : ''} {p.weight ? `• ${p.weight}kg` : ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.leanifiId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.treatmentStartDate ? new Date(p.treatmentStartDate).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href={`/clinician/patients/${p.id}/log-dose`} className="text-[#44BC95] hover:text-[#3aa882]">Log dose</a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}





