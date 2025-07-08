'use client';
import React, { useEffect, useState } from 'react';
import { ChartBarIcon, MagnifyingGlassIcon, LinkIcon } from '@heroicons/react/24/outline';

const StudentResultsPage = () => {
  const [tab, setTab] = useState<'results' | 'myresults'>('results');
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (tab === 'results') {
      fetch('/api/results')
        .then(res => res.json())
        .then(data => setResults(data));
    }
  }, [tab]);

  useEffect(() => {
    let filtered = results;
    if (filter) {
      filtered = filtered.filter((r: any) => r.title.toLowerCase().includes(filter.toLowerCase()));
    }
    // Stack: last in first out
    setFilteredResults([...filtered].reverse());
  }, [filter, results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Results</h2>
        </div>
        <div className="flex gap-4 justify-center mb-6">
          <button className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${tab === 'results' ? 'bg-pink-600 text-white' : 'bg-white bg-opacity-20 text-pink-200'}`} onClick={() => setTab('results')}>Results</button>
          <button className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${tab === 'myresults' ? 'bg-pink-600 text-white' : 'bg-white bg-opacity-20 text-pink-200'}`} onClick={() => setTab('myresults')}>My Results</button>
        </div>
        {tab === 'results' && (
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-2 mb-8 border border-white border-opacity-20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              <input type="text" placeholder="Filter by title..." className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 w-full" value={filter} onChange={e => setFilter(e.target.value)} />
            </div>
            {filteredResults.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <ChartBarIcon className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300">No results found.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredResults.map((r: any) => (
                  <div key={r._id} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white pr-2 break-words">{r.title}</h3>
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-sm text-gray-300 mb-2 break-words"><span className="font-medium text-white">Message:</span> {r.message}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-300">Link:</span>
                        {r.link ? (
                          <a href={r.link} className="inline-flex items-center gap-1 text-pink-400 underline" target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="w-4 h-4" /> Link
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-300"><span className="font-medium">Date:</span> {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === 'myresults' && (
          <div className="text-white text-center py-12 opacity-60 bg-white bg-opacity-10 rounded-2xl">(My Results tab coming soon...)</div>
        )}
      </div>
    </div>
  );
};

export default StudentResultsPage;
