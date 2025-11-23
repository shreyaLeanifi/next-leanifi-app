'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const doseLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  dosage: z.enum(['0.25mg', '0.5mg', '1mg', '1.7mg', '2.4mg'], {
    message: 'Please select a dosage',
  }),
  injectionSite: z.enum(['left_arm', 'right_arm', 'left_thigh', 'right_thigh', 'left_abdomen', 'right_abdomen'], {
    message: 'Please select an injection site',
  }),
  sideEffects: z.array(z.string()).optional(),
  sideEffectsNotes: z.string().optional(),
  notes: z.string().optional(),
});

type DoseLogForm = z.infer<typeof doseLogSchema>;

const sideEffectOptions = [
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Constipation',
  'Abdominal pain',
  'Headache',
  'Fatigue',
  'Dizziness',
  'Injection site reaction',
  'Other',
];

const injectionSiteOptions = [
  { value: 'left_arm', label: 'Left Arm' },
  { value: 'right_arm', label: 'Right Arm' },
  { value: 'left_thigh', label: 'Left Thigh' },
  { value: 'right_thigh', label: 'Right Thigh' },
  { value: 'left_abdomen', label: 'Left Abdomen' },
  { value: 'right_abdomen', label: 'Right Abdomen' },
];

export default function LogDosePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DoseLogForm>({
    resolver: zodResolver(doseLogSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
    },
  });

  const watchedSideEffects = watch('sideEffects') || [];

  const onSubmit = async (data: DoseLogForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/patient/doses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/patient/dashboard';
        }, 2000);
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to log dose');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSideEffectChange = (sideEffect: string, checked: boolean) => {
    const currentSideEffects = watchedSideEffects;
    if (checked) {
      setValue('sideEffects', [...currentSideEffects, sideEffect]);
    } else {
      setValue('sideEffects', currentSideEffects.filter(se => se !== sideEffect));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dose Logged Successfully!</h2>
          <p className="text-gray-600">Your dose has been recorded. Redirecting to dashboard...</p>
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
                onClick={() => window.location.href = '/patient/dashboard'}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-[#014446]">Log Dose</h1>
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
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Administration *
                </label>
                <input
                  {...register('date')}
                  type="date"
                  id="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time of Administration *
                </label>
                <input
                  {...register('time')}
                  type="time"
                  id="time"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage *
                </label>
                <select
                  {...register('dosage')}
                  id="dosage"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                >
                  <option value="">Select Dosage</option>
                  <option value="0.25mg">0.25mg</option>
                  <option value="0.5mg">0.5mg</option>
                  <option value="1mg">1mg</option>
                  <option value="1.7mg">1.7mg</option>
                  <option value="2.4mg">2.4mg</option>
                </select>
                {errors.dosage && (
                  <p className="mt-1 text-sm text-red-600">{errors.dosage.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="injectionSite" className="block text-sm font-medium text-gray-700 mb-2">
                  Injection Site *
                </label>
                <select
                  {...register('injectionSite')}
                  id="injectionSite"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                >
                  <option value="">Select Injection Site</option>
                  {injectionSiteOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.injectionSite && (
                  <p className="mt-1 text-sm text-red-600">{errors.injectionSite.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Side Effects (Select all that apply)
              </label>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Common Side Effects:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sideEffectOptions.map((sideEffect) => (
                  <label key={sideEffect} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={watchedSideEffects.includes(sideEffect)}
                      onChange={(e) => handleSideEffectChange(sideEffect, e.target.checked)}
                      className="h-4 w-4 text-[#44BC95] focus:ring-[#44BC95] border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{sideEffect}</span>
                  </label>
                ))}
                </div>
              </div>
              <div className="border-2 border-red-300 bg-red-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 mb-3">Rare/Serious Side Effects:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Pancreatitis', 'Serious/Severe Allergic Reactions (anaphylactic reactions)', 'Breathing problems', 'Swelling of face and throat', 'Wheezing', 'Tachycardia', 'Pale and cold skin'].map(opt => (
                    <label key={opt} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={watchedSideEffects.includes(opt)}
                        onChange={(e) => handleSideEffectChange(opt, e.target.checked)}
                        className="h-4 w-4 text-[#44BC95] focus:ring-[#44BC95] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="sideEffectsNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Side Effects Notes
              </label>
              <textarea
                {...register('sideEffectsNotes')}
                id="sideEffectsNotes"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                placeholder="Describe any side effects in detail..."
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                id="notes"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                placeholder="Any additional observations or notes..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.location.href = '/patient/dashboard'}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#44BC95] text-white rounded-lg font-medium hover:bg-[#3aa882] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging Dose...' : 'Log Dose'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
