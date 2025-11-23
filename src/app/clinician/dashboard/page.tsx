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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-3">
              <img
                src="/leanifi-logo.png"
                alt="Leanifi Logo"
                className="w-16 h-16 object-contain"
              />
              <div className="ml-2">
                <h1 className="text-sm font-medium bg-gradient-to-r from-[#014446] to-[#44BC95] bg-clip-text text-transparent">Clinician Dashboard</h1>
                <p className="text-xs text-gray-500">Patient Care Management</p>
              </div>
            </div>
            <button 
              onClick={() => { fetch('/api/auth/logout', { method: 'POST' }); location.href='/login'; }} 
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 card-hover relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-bl-full"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white"/>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Assigned Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '...' : patients.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 card-hover relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-100/50 rounded-bl-full"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Syringe className="w-7 h-7 text-white"/>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Doses Logged Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 card-hover relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100/50 rounded-bl-full"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="w-7 h-7 text-white"/>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Follow-ups</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">-</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#44BC95] to-[#3aa882] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Patients</h2>
            </div>
            <a href="/clinician/patients" className="text-[#44BC95] hover:text-[#3aa882] font-semibold flex items-center gap-2 transition-colors">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-[#44BC95] rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">Loading patients...</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-semibold">No patients assigned yet</p>
                <p className="text-sm text-gray-500 mt-1">Patients will appear here once assigned</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {patients.slice(0,5).map((p) => (
                  <li key={p.id} className="py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg px-3 -mx-3 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#44BC95]/10 to-[#014446]/10 rounded-xl flex items-center justify-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#44BC95] to-[#3aa882] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{p.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.leanifiId}</p>
                      </div>
                    </div>
                    <a 
                      href={`/clinician/patients/${p.id}/log-dose`} 
                      className="px-4 py-2 bg-gradient-to-r from-[#44BC95] to-[#3aa882] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#44BC95]/30 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                    >
                      <Syringe className="w-4 h-4" />
                      Log dose
                    </a>
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







