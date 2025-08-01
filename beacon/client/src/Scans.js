import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import Report from './Report';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Scans({ websiteId }) {
  const { token } = useAuth();
  const [scans, setScans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [selectedScanId, setSelectedScanId] = useState(null);

  async function fetchScans() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/scans/${websiteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch scans');
      setScans(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token && websiteId) fetchScans();
    // eslint-disable-next-line
  }, [token, websiteId]);

  async function handleScan() {
    setScanLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/scans/${websiteId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to initiate scan');
      fetchScans();
    } catch (err) {
      setError(err.message);
    } finally {
      setScanLoading(false);
    }
  }

  if (selectedScanId) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <button
          className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setSelectedScanId(null)}
        >
          ← Back to Scans
        </button>
        <Report scanId={selectedScanId} />
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Scans</h3>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          onClick={handleScan}
          disabled={scanLoading}
        >
          {scanLoading ? 'Scanning...' : 'Scan Now'}
        </button>
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {loading ? (
        <div>Loading scans...</div>
      ) : (
        <ul className="divide-y">
          {scans.map(s => (
            <li key={s._id} className="py-2 flex items-center justify-between">
              <span className="text-sm">{s.status} {s.completedAt ? `- ${new Date(s.completedAt).toLocaleString()}` : ''}</span>
              <button
                className="text-blue-600 underline text-xs"
                onClick={() => setSelectedScanId(s._id)}
              >
                View Report
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Scans;
