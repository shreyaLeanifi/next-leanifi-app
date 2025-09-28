'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const patientSchema = z.object({
  leanifiId: z.string().min(1, 'Leanifi ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender',
  }),
  weight: z.number().min(1, 'Weight must be at least 1kg'),
  treatmentStartDate: z.string().min(1, 'Treatment start date is required'),
  allergies: z.string().optional(),
});

type PatientForm = z.infer<typeof patientSchema>;

export default function NewPatientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        window.location.href = '/admin/patients';
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to create patient');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => window.location.href = '/admin/patients'}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back to Patients
              </button>
              <h1 className="text-2xl font-bold text-[#014446]">Add New Patient</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="leanifiId" className="block text-sm font-medium text-gray-700 mb-2">
                  Leanifi ID *
                </label>
                <input
                  {...register('leanifiId')}
                  type="text"
                  id="leanifiId"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                  placeholder="e.g., LF001"
                />
                {errors.leanifiId && (
                  <p className="mt-1 text-sm text-red-600">{errors.leanifiId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Password *
                </label>
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                  placeholder="Patient's initial password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.location.href = '/admin/patients'}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#44BC95] text-white rounded-lg font-medium hover:bg-[#3aa882] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Patient...' : 'Create Patient'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
