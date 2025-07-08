"use client";
import { useState } from "react";

export default function AddResults() {
  const [tab, setTab] = useState<'together' | 'individual'>('together');
  const [form, setForm] = useState({ title: '', message: '', link: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add result');
      }
      setSuccess('Result added successfully!');
      setForm({ title: '', message: '', link: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 shadow-xl">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${tab === 'together' ? 'bg-purple-600 text-white' : 'bg-white bg-opacity-20 text-purple-200'}`}
            onClick={() => setTab('together')}
          >
            Add Result Together
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${tab === 'individual' ? 'bg-purple-600 text-white' : 'bg-white bg-opacity-20 text-purple-200'}`}
            onClick={() => setTab('individual')}
          >
            Add Result Individually
          </button>
        </div>
        {tab === 'together' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter result title"
                required
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter result message"
                required
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-1">Link</label>
              <input
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter result link (optional)"
              />
            </div>
            {success && <div className="text-green-400 font-semibold">{success}</div>}
            {error && <div className="text-red-400 font-semibold">{error}</div>}
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold shadow hover:bg-purple-700 transition-all duration-200" disabled={loading}>
                {loading ? 'Adding...' : 'Add Result'}
              </button>
            </div>
          </form>
        )}
        {tab === 'individual' && (
          <div className="text-white text-center py-12 opacity-60">(Individual result form coming soon...)</div>
        )}
      </div>
    </div>
  );
}
