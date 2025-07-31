import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { IssuesBySeverity, IssuesByWCAG, IssuesTrend } from './components/DashboardCharts';
import SiteCompare from './components/SiteCompare';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { token } = useAuth();
  const [scans, setScans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchScans() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/scans/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch scans');
        setScans(await res.json());
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchScans();
  }, [token]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!scans.length) return <div className="text-gray-500">No scans yet.</div>;

  // Aggregate issues
  const allIssues = scans.flatMap(s => s.issues || []);
  const totalWebsites = new Set(scans.map(s => s.website)).size;
  const totalScans = scans.length;
  const totalIssues = allIssues.length;
  const lastScan = scans[0]?.completedAt;
  const score = totalIssues === 0 ? 100 : Math.max(0, 100 - totalIssues * 2); // Example score

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded">
          <div className="text-2xl font-bold">{totalWebsites}</div>
          <div className="text-sm">Websites</div>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <div className="text-2xl font-bold">{totalScans}</div>
          <div className="text-sm">Scans</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <div className="text-2xl font-bold">{totalIssues}</div>
          <div className="text-sm">Issues</div>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-xs">Last Scan</div>
          <div className="text-sm">{lastScan ? new Date(lastScan).toLocaleString() : '-'}</div>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-1">Accessibility Score</div>
        <div className="text-3xl font-bold text-green-600">{score}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <IssuesBySeverity issues={allIssues} />
        </div>
        <div>
          <IssuesByWCAG issues={allIssues} />
        </div>
        <div>
          <IssuesTrend scans={scans} />
        </div>
      </div>
      <SiteCompare token={token} />
    </div>
  );
}
