'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Weight, Activity } from 'lucide-react';

interface Patient {
  id: string;
  leanifiId: string;
  name: string;
  age?: number;
  gender?: string;
  weight?: number;
  treatmentStartDate?: string;
  allergies?: string;
  medicalHistory?: string;
  familyHistory?: string;
  medications?: string;
  socialHistory?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Dose {
  id: string;
  date: string;
  dosage: string;
  medicationName?: string;
  status: string;
  notes?: string;
  sideEffects?: string[];
}

export default function PatientViewPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doses, setDoses] = useState<Dose[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPatientData = useCallback(async () => {
    if (!patientId) return;
    
    try {
      const response = await fetch(`/api/admin/patients/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.patient) {
          setPatient(data.patient);
        } else {
          setError('Patient not found');
        }
      } else {
        setError('Failed to load patient data');
      }
    } catch {
      setError('Error loading patient data');
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  const fetchDoses = useCallback(async () => {
    if (!patientId) return;
    
    try {
      const response = await fetch(`/api/clinician/doses?patientId=${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setDoses(data.doses || []);
      }
    } catch {
      console.error('Error fetching doses');
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchDoses();
    }
  }, [patientId, fetchPatientData, fetchDoses]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44BC95] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient records...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Patient not found'}</p>
          <button
            onClick={() => router.push('/admin/patients')}
            className="bg-[#44BC95] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3aa882] transition-colors"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => router.push('/admin/patients')}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-[#014446]">Patient Records</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#44BC95] rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                <p className="text-gray-600">Leanifi ID: {patient.leanifiId}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              patient.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {patient.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-lg font-semibold text-gray-900">{patient.age || 'N/A'} years</p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{patient.gender || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Weight className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="text-lg font-semibold text-gray-900">{patient.weight ? `${patient.weight} kg` : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Treatment Start</p>
                <p className="text-lg font-semibold text-gray-900">
                  {patient.treatmentStartDate ? new Date(patient.treatmentStartDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {patient.medicalHistory || 'No medical history recorded'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Family History</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {patient.familyHistory || 'No family history recorded'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medications & Doses</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {patient.medications || 'No medications recorded'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social History</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {patient.socialHistory || 'No social history recorded'}
            </p>
          </div>
        </div>

        {/* Allergies */}
        {patient.allergies && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies / Contraindications</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{patient.allergies}</p>
          </div>
        )}

        {/* Dose History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dose History</h3>
          {doses.length === 0 ? (
            <p className="text-gray-500">No doses recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doses.map((dose) => (
                    <tr key={dose.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(dose.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dose.medicationName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dose.dosage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          dose.status === 'administered'
                            ? 'bg-green-100 text-green-800'
                            : dose.status === 'missed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {dose.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {dose.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

