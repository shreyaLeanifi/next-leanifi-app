'use client';

import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#44BC95] rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#014446]">Welcome{patientData?.name ? `, ${patientData.name}` : ''}</h1>
                {patientData?.leanifiId && (
                  <p className="text-gray-600">Leanifi ID: {patientData.leanifiId}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/patient/settings'}
                className="text-gray-600 hover:text-gray-900"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/login';
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Dose Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today&apos;s Dose Status</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patientData?.lastDoseStatus || 'pending')}`}>
              {getStatusText(patientData?.lastDoseStatus || 'pending')}
            </div>
          </div>
          
          {patientData ? (
            <div className="flex items-center space-x-4">
              {getStatusIcon(patientData?.lastDoseStatus || 'pending')}
              <div>
                <p className="text-gray-600">
                  {patientData?.lastDoseStatus === 'taken' 
                    ? `Last dose taken on ${patientData?.lastDoseDate ? new Date(patientData.lastDoseDate).toLocaleDateString() : 'N/A'}`
                    : patientData?.lastDoseStatus === 'missed'
                    ? 'You missed your last scheduled dose'
                    : 'Your next dose is due soon'}
                </p>
                {patientData?.nextDoseDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Next dose: {new Date(patientData.nextDoseDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No dose data yet. Log your first dose to see your status here.
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/patient/log-dose'}
              className="bg-[#44BC95] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3aa882] transition-colors"
            >
              Log Dose Now
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Treatment Week</p>
                <p className="text-2xl font-bold text-gray-900">{patientData?.currentWeek ?? '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Weight Change</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientData?.weightChange && patientData.weightChange > 0 ? '+' : ''}
                  {patientData?.weightChange ?? '-'}{patientData ? 'kg' : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Weight</p>
                <p className="text-2xl font-bold text-gray-900">{patientData?.weight ?? '-'}{patientData ? 'kg' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/patient/log-dose'}
                className="w-full bg-[#44BC95] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#3aa882] transition-colors"
              >
                Log Today&apos;s Dose
              </button>
              <button
                onClick={() => window.location.href = '/patient/missed-dose'}
                className="w-full bg-white text-red-600 py-3 px-4 rounded-lg font-medium border border-red-600 hover:bg-red-50 transition-colors"
              >
                Report Missed Dose
              </button>
              <button
                onClick={() => window.location.href = '/patient/history'}
                className="w-full bg-white text-[#014446] py-3 px-4 rounded-lg font-medium border border-[#014446] hover:bg-[#014446] hover:text-white transition-colors"
              >
                View Dose History
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/patient/resources/injection-guide'}
                className="w-full text-left text-[#44BC95] hover:text-[#3aa882] py-2"
              >
                📹 How to Inject Safely
              </button>
              <button
                onClick={() => window.location.href = '/patient/resources/faq'}
                className="w-full text-left text-[#44BC95] hover:text-[#3aa882] py-2"
              >
                ❓ Semaglutide FAQ
              </button>
              <button
                onClick={() => window.location.href = '/patient/resources/contact'}
                className="w-full text-left text-[#44BC95] hover:text-[#3aa882] py-2"
              >
                📞 Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
