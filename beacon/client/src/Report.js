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
        // Placeholder: implement backend scan report endpoint for real data
        setReport({
          url: 'https://example.com',
          date: '2025-07-31T10:00:00Z',
          issues: [
            { id: 1, description: 'Image missing alt attribute', impact: 'serious', node: '<img src="foo.jpg">' },
            { id: 2, description: 'Low contrast text', impact: 'moderate', node: '<span style="color:#ccc">Text</span>' },
          ],
        });
      } catch (err) {
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    }
    if (token && scanId) fetchReport();
  }, [token, scanId]);

  if (loading) return <div>Loading report...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!report) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Accessibility Report</h2>
      <div className="mb-2 text-sm text-gray-600">URL: {report.url}</div>
      <div className="mb-2 text-sm text-gray-600">Date: {new Date(report.date).toLocaleString()}</div>
      <div className="mb-4 text-sm text-gray-600">Issues: {report.issues.length}</div>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Impact</th>
            <th className="p-2 border">Node</th>
          </tr>
        </thead>
        <tbody>
          {report.issues.map(issue => (
            <tr key={issue.id} className="border-b">
              <td className="p-2 border">{issue.description}</td>
              <td className="p-2 border">{issue.impact}</td>
              <td className="p-2 border font-mono">{issue.node}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
