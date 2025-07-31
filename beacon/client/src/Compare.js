import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Compare({ websiteId }) {
  const { token } = useAuth();
  const [scans, setScans] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    async function fetchScans() {
      setLoading(true);
      setError('');
      try {
        // Placeholder: implement backend scan listing endpoint for real data
        setScans([
          { _id: '1', date: '2025-07-31T10:00:00Z', issues: 5 },
          { _id: '2', date: '2025-07-30T09:00:00Z', issues: 7 },
        ]);
      } catch (err) {
        setError('Failed to load scans');
      } finally {
        setLoading(false);
      }
    }
    if (websiteId && token) fetchScans();
  }, [websiteId, token]);

  function handleSelect(scanId) {
    setSelected(prev => {
      if (prev.includes(scanId)) return prev.filter(id => id !== scanId);
      if (prev.length < 2) return [...prev, scanId];
      return prev;
    });
  }

  function handleCompare() {
    // Placeholder: implement backend or client-side diff logic
    setDiff({
      added: ['New issue: Button missing label'],
      removed: ['Fixed: Image missing alt'],
      unchanged: ['Low contrast text'],
    });
  }

  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Compare Scans</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading scans...</div>
      ) : (
        <>
          <ul className="divide-y mb-4">
            {scans.map(scan => (
              <li key={scan._id} className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  checked={selected.includes(scan._id)}
                  onChange={() => handleSelect(scan._id)}
                  disabled={selected.length === 2 && !selected.includes(scan._id)}
                />
                <span>{new Date(scan.date).toLocaleString()} - {scan.issues} issues</span>
              </li>
            ))}
          </ul>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            onClick={handleCompare}
            disabled={selected.length !== 2}
          >
            Compare
          </button>
        </>
      )}
      {diff && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Comparison Result</h4>
          <div className="mb-2 text-green-700">Added: {diff.added.join(', ')}</div>
          <div className="mb-2 text-red-700">Removed: {diff.removed.join(', ')}</div>
          <div className="mb-2 text-gray-700">Unchanged: {diff.unchanged.join(', ')}</div>
        </div>
      )}
    </div>
  );
}
