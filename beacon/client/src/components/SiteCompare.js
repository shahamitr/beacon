import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function SiteCompare({ token }) {
  const [sites, setSites] = useState([]);
  const [scans, setScans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [webRes, scanRes] = await Promise.all([
          fetch(`${API_URL}/websites`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/scans/all`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        if (!webRes.ok || !scanRes.ok) throw new Error('Failed to fetch data');
        const websites = await webRes.json();
        const allScans = await scanRes.json();
        setSites(websites);
        setScans(allScans);
      } catch (err) {
        setError('Failed to load site comparison');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  if (loading) return <div>Loading site comparison...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!sites.length || !scans.length) return <div className="text-gray-500">No data to compare.</div>;

  // Aggregate: for each site, get latest scan's issue count
  const siteData = sites.map(site => {
    const siteScans = scans.filter(s => s.website === site._id && s.issues && s.issues.length);
    const latest = siteScans.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
    return {
      name: site.name,
      issues: latest ? latest.issues.length : 0,
    };
  });

  const data = {
    labels: siteData.map(s => s.name),
    datasets: [
      {
        label: 'Latest Issues per Site',
        data: siteData.map(s => s.issues),
        backgroundColor: '#f87171',
      },
    ],
  };

  return (
    <div className="mt-8 p-6 bg-white rounded shadow">
      <h3 className="font-semibold mb-4">Site-to-Site Comparison (Latest Scan)</h3>
      <Bar data={data} />
    </div>
  );
}
