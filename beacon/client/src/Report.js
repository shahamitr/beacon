import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Report({ scanId }) {
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/scans/detail/${scanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch report');
        setReport(await res.json());
      } catch (err) {
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    }
    if (token && scanId) fetchReport();
  }, [token, scanId]);

  function download(type) {
    window.open(`${API_URL}/export/scan/${scanId}/${type}`, '_blank');
  }

  if (loading) return <div>Loading report...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!report) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Accessibility Report</h2>
      <div className="mb-2 text-sm text-gray-600">URL: {report.website?.url || report.url}</div>
      <div className="mb-2 text-sm text-gray-600">Date: {report.completedAt ? new Date(report.completedAt).toLocaleString() : ''}</div>
      <div className="mb-4 text-sm text-gray-600">Issues: {report.issues?.length || 0}</div>
      <div className="flex gap-2 mb-4">
        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => download('csv')}>Download CSV</button>
        <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => download('excel')}>Download Excel</button>
        <button className="px-3 py-1 bg-gray-700 text-white rounded" onClick={() => download('pdf')}>Download PDF</button>
      </div>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Impact</th>
            <th className="p-2 border">Selector</th>
            <th className="p-2 border">WCAG</th>
          </tr>
        </thead>
        <tbody>
          {(report.issues || []).map((issue, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-2 border">{issue.description}</td>
              <td className="p-2 border">{issue.impact}</td>
              <td className="p-2 border font-mono">{issue.selector}</td>
              <td className="p-2 border">{issue.wcag || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
