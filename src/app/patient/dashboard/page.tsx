'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface PatientData {
  name: string;
  leanifiId: string;
  weight: number;
  treatmentStartDate: string;
  nextDoseDate: string;
  currentWeek: number;
  lastDoseDate?: string;
  lastDoseStatus: 'taken' | 'missed' | 'overdue';
  weightChange: number;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const resp = await fetch('/api/patient/me');
      if (resp.ok) {
        const data = await resp.json();
        setPatientData(data.patient || null);
      } else {
        setPatientData(null);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setPatientData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'missed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'overdue':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'taken':
        return 'Dose Taken';
      case 'missed':
        return 'Dose Missed';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'overdue':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44BC95] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#44BC95] to-[#3aa882] rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#014446] to-[#44BC95] bg-clip-text text-transparent">
                  Welcome{patientData?.name ? `, ${patientData.name}` : ''}
                </h1>
                {patientData?.leanifiId && (
                  <p className="text-sm text-gray-600 font-medium">Leanifi ID: {patientData.leanifiId}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/patient/settings'}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
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
        {/* Today's Dose Status */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#44BC95]/10 to-transparent rounded-bl-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#44BC95] to-[#3aa882] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Today&apos;s Dose Status</h2>
              </div>
              <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md ${getStatusColor(patientData?.lastDoseStatus || 'pending')}`}>
                {getStatusText(patientData?.lastDoseStatus || 'pending')}
              </div>
            </div>
            
            {patientData ? (
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                  {getStatusIcon(patientData?.lastDoseStatus || 'pending')}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 font-medium text-lg">
                    {patientData?.lastDoseStatus === 'taken' 
                      ? `Last dose taken on ${patientData?.lastDoseDate ? new Date(patientData.lastDoseDate).toLocaleDateString() : 'N/A'}`
                      : patientData?.lastDoseStatus === 'missed'
                      ? 'You missed your last scheduled dose'
                      : 'Your next dose is due soon'}
                  </p>
                  {patientData?.nextDoseDate && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Next dose: {new Date(patientData.nextDoseDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-medium">No dose data yet</p>
                <p className="text-sm mt-1">Log your first dose to see your status here</p>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/patient/log-dose'}
                className="bg-gradient-to-r from-[#44BC95] to-[#3aa882] text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-[#44BC95]/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Log Dose Now
              </button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 card-hover relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-bl-full"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Treatment Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{patientData?.currentWeek ?? '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 card-hover relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-100/50 rounded-bl-full"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Weight Change</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {patientData?.weightChange && patientData.weightChange > 0 ? '+' : ''}
                  {patientData?.weightChange ?? '-'}{patientData ? 'kg' : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 card-hover relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 rounded-bl-full"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Weight</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{patientData?.weight ?? '-'}{patientData ? 'kg' : ''}</p>
              </div>
            </div>
          </div>
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
                onClick={() => router.push('/patient/log-dose')}
                className="w-full bg-gradient-to-r from-[#44BC95] to-[#3aa882] text-white py-3.5 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#44BC95]/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Log Today&apos;s Dose
              </button>
              <button
                onClick={() => router.push('/patient/missed-dose')}
                className="w-full bg-white text-red-600 py-3.5 px-4 rounded-xl font-semibold border-2 border-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report Missed Dose
              </button>
              <button
                onClick={() => router.push('/patient/settings')}
                className="w-full bg-white text-[#014446] py-3.5 px-4 rounded-xl font-semibold border-2 border-[#014446] hover:bg-[#014446] hover:text-white hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View Settings
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#44BC95]/5 to-[#014446]/5 rounded-2xl shadow-lg p-8 border border-gray-100 card-hover">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#014446] to-[#44BC95] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Resources</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/patient/resources/injection-guide'}
                className="w-full text-left text-[#44BC95] hover:text-[#3aa882] py-3 px-4 rounded-xl font-semibold hover:bg-white/50 transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-[#44BC95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>How to Inject Safely</span>
              </button>
              <button
                onClick={() => window.location.href = '/patient/resources/faq'}
                className="w-full text-left text-[#44BC95] hover:text-[#3aa882] py-3 px-4 rounded-xl font-semibold hover:bg-white/50 transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-[#44BC95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Semaglutide FAQ</span>
              </button>
              <button
                onClick={() => window.location.href = '/patient/resources/contact'}
                className="w-full text-left text-[#44BC95] hover:text-[#3aa882] py-3 px-4 rounded-xl font-semibold hover:bg-white/50 transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-[#44BC95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
