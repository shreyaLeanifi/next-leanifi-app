'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const missedDoseSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  missedReason: z.enum(['forgot', 'unwell', 'no_supply', 'other'], {
    required_error: 'Please select a reason',
  }),
  missedReasonNotes: z.string().optional(),
});

type MissedDoseForm = z.infer<typeof missedDoseSchema>;

const missedReasons = [
  { value: 'forgot', label: 'Forgot to take dose' },
  { value: 'unwell', label: 'Feeling unwell' },
  { value: 'no_supply', label: 'No medication supply' },
  { value: 'other', label: 'Other reason' },
];

export default function MissedDosePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MissedDoseForm>({
    resolver: zodResolver(missedDoseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const watchedReason = watch('missedReason');

  const onSubmit = async (data: MissedDoseForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/patient/missed-dose', {
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
        setError(result.error || 'Failed to report missed dose');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Missed Dose Reported</h2>
          <p className="text-gray-600">Your missed dose has been recorded. Your healthcare team will be notified.</p>
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
              <h1 className="text-2xl font-bold text-[#014446]">Report Missed Dose</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important: Missed Dose Protocol
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>If you miss a dose, take it as soon as you remember, but do not take two doses within 3 days of each other. Contact your healthcare provider if you have concerns.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Missed Dose *
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Missing Dose *
              </label>
              <div className="space-y-3">
                {missedReasons.map((reason) => (
                  <label key={reason.value} className="flex items-center">
                    <input
                      {...register('missedReason')}
                      type="radio"
                      value={reason.value}
                      className="h-4 w-4 text-[#44BC95] focus:ring-[#44BC95] border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{reason.label}</span>
                  </label>
                ))}
              </div>
              {errors.missedReason && (
                <p className="mt-1 text-sm text-red-600">{errors.missedReason.message}</p>
              )}
            </div>

            {watchedReason === 'other' && (
              <div>
                <label htmlFor="missedReasonNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify the reason *
                </label>
                <textarea
                  {...register('missedReasonNotes', {
                    required: watchedReason === 'other' ? 'Please specify the reason' : false,
                  })}
                  id="missedReasonNotes"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                  placeholder="Please describe the reason for missing the dose..."
                />
                {errors.missedReasonNotes && (
                  <p className="mt-1 text-sm text-red-600">{errors.missedReasonNotes.message}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="missedReasonNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                {...register('missedReasonNotes')}
                id="missedReasonNotes"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44BC95] focus:border-transparent"
                placeholder="Any additional information about the missed dose..."
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
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Reporting...' : 'Report Missed Dose'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
