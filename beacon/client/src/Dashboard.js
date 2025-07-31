import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError('');
      try {
        // Placeholder: implement backend summary endpoint for real data
        setSummary({
          totalWebsites: 2,
          totalScans: 5,
          issues: 12,
          lastScan: '2025-07-31T10:00:00Z',
        });
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchSummary();
  }, [token]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!summary) return null;

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded">
          <div className="text-2xl font-bold">{summary.totalWebsites}</div>
          <div className="text-sm">Websites</div>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <div className="text-2xl font-bold">{summary.totalScans}</div>
          <div className="text-sm">Scans</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <div className="text-2xl font-bold">{summary.issues}</div>
          <div className="text-sm">Issues</div>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-xs">Last Scan</div>
          <div className="text-sm">{new Date(summary.lastScan).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
