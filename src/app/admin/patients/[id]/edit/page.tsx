'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Please select a gender',
  }),
  weight: z.number().min(1, 'Weight must be at least 1kg'),
  treatmentStartDate: z.string().min(1, 'Treatment start date is required'),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  medications: z.string().optional(),
  socialHistory: z.string().optional(),
  isActive: z.boolean(),
});

type PatientForm = z.infer<typeof patientSchema>;

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
  });

  const fetchPatientData = useCallback(async () => {
    if (!patientId) return;
    
    try {
      const response = await fetch(`/api/admin/patients/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.patient) {
          const patient = data.patient;
          reset({
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            weight: patient.weight,
            treatmentStartDate: patient.treatmentStartDate
              ? new Date(patient.treatmentStartDate).toISOString().split('T')[0]
              : '',
            allergies: patient.allergies || '',
            medicalHistory: patient.medicalHistory || '',
            familyHistory: patient.familyHistory || '',
            medications: patient.medications || '',
            socialHistory: patient.socialHistory || '',
            isActive: patient.isActive ?? true,
          });
        } else {
          setError('Patient not found');
        }
      } else {
        setError('Failed to load patient data');
      }
    } catch {
      setError('Error loading patient data');
    } finally {
      setIsFetching(false);
    }
  }, [patientId, reset]);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId, fetchPatientData]);

  const onSubmit = async (data: PatientForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push(`/admin/patients/${patientId}`);
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to update patient');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44BC95] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
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
              <button
                onClick={() => router.push(`/admin/patients/${patientId}`)}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back to Patient
              </button>
              <h1 className="text-2xl font-bold text-[#014446]">Edit Patient</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                placeholder="Patient's full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  {...register('age', { valueAsNumber: true })}
                  type="number"
                  id="age"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                  placeholder="Age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  {...register('gender')}
                  id="gender"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  {...register('weight', { valueAsNumber: true })}
                  type="number"
                  id="weight"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                  placeholder="Weight in kg"
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="treatmentStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                Treatment Start Date *
              </label>
              <input
                {...register('treatmentStartDate')}
                type="date"
                id="treatmentStartDate"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
              />
              {errors.treatmentStartDate && (
                <p className="mt-1 text-sm text-red-600">{errors.treatmentStartDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                Known Allergies / Contraindications
              </label>
              <textarea
                {...register('allergies')}
                id="allergies"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                placeholder="Enter any known allergies or contraindications..."
              />
              {errors.allergies && (
                <p className="mt-1 text-sm text-red-600">{errors.allergies.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-2">
                Medical History
              </label>
              <textarea
                {...register('medicalHistory')}
                id="medicalHistory"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                placeholder="Enter patient's medical history..."
              />
              {errors.medicalHistory && (
                <p className="mt-1 text-sm text-red-600">{errors.medicalHistory.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="familyHistory" className="block text-sm font-medium text-gray-700 mb-2">
                Family History
              </label>
              <textarea
                {...register('familyHistory')}
                id="familyHistory"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                placeholder="Enter patient's family history..."
              />
              {errors.familyHistory && (
                <p className="mt-1 text-sm text-red-600">{errors.familyHistory.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-2">
                Medications + Doses
              </label>
              <textarea
                {...register('medications')}
                id="medications"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                placeholder="Enter current medications and their doses..."
              />
              {errors.medications && (
                <p className="mt-1 text-sm text-red-600">{errors.medications.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="socialHistory" className="block text-sm font-medium text-gray-700 mb-2">
                Social History
              </label>
              <textarea
                {...register('socialHistory')}
                id="socialHistory"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                placeholder="Enter patient's social history..."
              />
              {errors.socialHistory && (
                <p className="mt-1 text-sm text-red-600">{errors.socialHistory.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="h-4 w-4 text-[#44BC95] focus:ring-[#44BC95] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active Patient</span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push(`/admin/patients/${patientId}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#44BC95] text-white rounded-lg font-medium hover:bg-[#3aa882] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating Patient...' : 'Update Patient'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}


