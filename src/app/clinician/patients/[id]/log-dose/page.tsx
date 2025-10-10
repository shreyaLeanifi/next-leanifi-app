'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ClinicianLogDosePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);

    const payload = {
      patientId,
      date: formData.get('date'),
      time: formData.get('time'),
      dosage: formData.get('dosage'),
      injectionSite: formData.get('injectionSite'),
      status: formData.get('status'),
      batchNumber: formData.get('batchNumber'),
      clinicianInitials: formData.get('clinicianInitials'),
      sideEffects: Array.from(formData.getAll('sideEffects')),
      sideEffectsNotes: formData.get('sideEffectsNotes'),
      notes: formData.get('notes'),
    };

    try {
      const resp = await fetch('/api/clinician/doses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        router.push('/clinician/dashboard');
      } else {
        const data = await resp.json();
        setError(data.error || 'Failed to log dose');
      }
    } catch (err) {
      setError('Failed to log dose');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900">← Back</button>
            <h1 className="text-2xl font-bold text-[#014446]">Log Dose</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
              <input name="time" type="time" required defaultValue={new Date().toTimeString().slice(0,5)} className="w-full px-4 py-3 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
              <select name="dosage" required className="w-full px-4 py-3 border rounded-lg">
                <option value="">Select dosage</option>
                <option value="0.25mg">0.25mg</option>
                <option value="0.5mg">0.5mg</option>
                <option value="1mg">1mg</option>
                <option value="1.7mg">1.7mg</option>
                <option value="2.4mg">2.4mg</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Injection Site *</label>
              <select name="injectionSite" required className="w-full px-4 py-3 border rounded-lg">
                <option value="">Select site</option>
                <option value="left_arm">Left Arm</option>
                <option value="right_arm">Right Arm</option>
                <option value="left_thigh">Left Thigh</option>
                <option value="right_thigh">Right Thigh</option>
                <option value="left_abdomen">Left Abdomen</option>
                <option value="right_abdomen">Right Abdomen</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select name="status" required className="w-full px-4 py-3 border rounded-lg">
                <option value="administered">Administered</option>
                <option value="missed">Missed</option>
                <option value="refused">Refused</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch/Lot Number</label>
              <input name="batchNumber" type="text" className="w-full px-4 py-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clinician Initials</label>
              <input name="clinicianInitials" type="text" className="w-full px-4 py-3 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Side Effects</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {['Nausea','Vomiting','Diarrhea','Constipation','Headache','Dizziness','Injection site reaction','Fatigue','Other'].map(opt => (
                <label key={opt} className="flex items-center">
                  <input type="checkbox" name="sideEffects" value={opt} className="mr-2" /> {opt}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Side Effects Notes</label>
            <textarea name="sideEffectsNotes" rows={3} className="w-full px-4 py-3 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Comments</label>
            <textarea name="notes" rows={3} className="w-full px-4 py-3 border rounded-lg" />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div className="flex justify-end">
            <button disabled={isLoading} className="px-6 py-3 bg-[#44BC95] text-white rounded-lg font-medium hover:bg-[#3aa882] disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Save Dose'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}





