'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Users } from 'lucide-react';

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

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; patient: Patient | null }>({
    isOpen: false,
    patient: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  // Refresh patients list when returning from new patient page
  useEffect(() => {
    const handleFocus = () => {
      fetchPatients();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/admin/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients || []);
      } else {
        console.error('Failed to fetch patients');
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.leanifiId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (patient: Patient) => {
    setDeleteModal({ isOpen: true, patient });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.patient) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/patients/${deleteModal.patient.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove patient from list
        setPatients(patients.filter(p => p.id !== deleteModal.patient?.id));
        setDeleteModal({ isOpen: false, patient: null });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete patient');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('An error occurred while deleting the patient');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, patient: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-[#44BC95] to-[#3aa882] rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#014446] to-[#44BC95] bg-clip-text text-transparent">Patient Management</h1>
                <p className="text-xs text-gray-500 font-medium">Manage all patient records</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/admin/patients/new'}
              className="bg-gradient-to-r from-[#44BC95] to-[#3aa882] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#44BC95]/30 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Patient
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients by name or Leanifi ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#44BC95] focus:border-[#44BC95] transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#44BC95] focus:border-[#44BC95] bg-gray-50 focus:bg-white transition-all duration-200 font-medium">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Leanifi ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Treatment Start
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Last Dose
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Next Dose
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Loading patients...
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">No patients yet</p>
                        <p className="text-gray-500 mb-4">Get started by adding your first patient</p>
                        <button
                          onClick={() => window.location.href = '/admin/patients/new'}
                          className="bg-[#44BC95] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3aa882] transition-colors"
                        >
                          Add First Patient
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#44BC95]/10 to-[#014446]/10 rounded-xl flex items-center justify-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#44BC95] to-[#3aa882] rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{patient.name.charAt(0)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {patient.name}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {patient.age} years, {patient.gender} • {patient.weight}kg
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                          {patient.leanifiId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {new Date(patient.treatmentStartDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        N/A
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        N/A
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm ${
                          patient.isActive
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {patient.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.location.href = `/admin/patients/${patient.id}`}
                            className="p-2 text-[#44BC95] hover:bg-[#44BC95]/10 rounded-lg transition-colors"
                            title="View Patient"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => window.location.href = `/admin/patients/${patient.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Patient"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(patient)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Patient"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.patient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Patient</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{deleteModal.patient.name}</strong> (Leanifi ID: {deleteModal.patient.leanifiId})? 
                This action cannot be undone and will permanently remove all patient data.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Patient'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
