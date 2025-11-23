'use client';

import { useState, useEffect } from 'react';
import { Users, Activity, AlertTriangle, Calendar } from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  missedDoses: number;
  overdueInjections: number;
}

interface Patient {
  id: string;
  leanifiId: string;
  name: string;
  age: number;
  gender: string;
  weight: number;
  treatmentStartDate: string;
  isActive: boolean;
  allergies?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    missedDoses: 0,
    overdueInjections: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch patients data
      const patientsResponse = await fetch('/api/admin/patients');
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        const patients = patientsData.patients || [];
        
        setStats({
          totalPatients: patients.length,
          activePatients: patients.filter((p: Patient) => p.isActive).length,
          missedDoses: 0, // TODO: Calculate from doses data
          overdueInjections: 0, // TODO: Calculate from doses data
        });
      } else {
        setStats({
          totalPatients: 0,
          activePatients: 0,
          missedDoses: 0,
          overdueInjections: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        totalPatients: 0,
        activePatients: 0,
        missedDoses: 0,
        overdueInjections: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Patients',
      value: stats.activePatients,
      icon: Activity,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Missed Doses',
      value: stats.missedDoses,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Overdue Injections',
      value: stats.overdueInjections,
      icon: Calendar,
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
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
                <h1 className="text-sm font-medium bg-gradient-to-r from-[#014446] to-[#44BC95] bg-clip-text text-transparent">Leanifi Admin</h1>
                <p className="text-xs text-gray-500">eMAR Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/login';
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Dashboard</h2>
          <p className="text-gray-600 text-lg">Overview of your eMAR system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 card-hover border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${stat.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.textColor} mt-1`}>
                      {isLoading ? (
                        <span className="inline-block w-8 h-8 border-2 border-gray-300 border-t-[#44BC95] rounded-full animate-spin"></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 card-hover">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#44BC95] to-[#3aa882] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/admin/patients/new'}
                className="w-full bg-gradient-to-r from-[#44BC95] to-[#3aa882] text-white py-3.5 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#44BC95]/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New Patient
              </button>
              <button
                onClick={() => window.location.href = '/admin/patients'}
                className="w-full bg-white text-[#44BC95] py-3.5 px-4 rounded-xl font-semibold border-2 border-[#44BC95] hover:bg-[#44BC95] hover:text-white hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View All Patients
              </button>
              <button
                onClick={() => window.location.href = '/admin/reports'}
                className="w-full bg-white text-[#014446] py-3.5 px-4 rounded-xl font-semibold border-2 border-[#014446] hover:bg-[#014446] hover:text-white hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Reports
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#44BC95]/5 to-[#014446]/5 rounded-2xl shadow-lg p-8 border border-gray-100 card-hover">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#014446] to-[#44BC95] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-600 font-semibold mb-1">No recent activity</p>
              <p className="text-sm text-gray-500">Activity will appear here as patients use the system</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
