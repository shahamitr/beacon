import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function IssuesBySeverity({ issues }) {
  const counts = issues.reduce((acc, i) => {
    acc[i.impact] = (acc[i.impact] || 0) + 1;
    return acc;
  }, {});
  const data = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: 'Issues by Severity',
        data: Object.values(counts),
        backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#34d399'],
      },
    ],
  };
  return <Pie data={data} />;
}

export function IssuesByWCAG({ issues }) {
  const counts = issues.reduce((acc, i) => {
    acc[i.wcagLevel || 'Unmapped'] = (acc[i.wcagLevel || 'Unmapped'] || 0) + 1;
    return acc;
  }, {});
  const data = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: 'Issues by WCAG Level',
        data: Object.values(counts),
        backgroundColor: ['#fbbf24', '#60a5fa', '#a78bfa', '#d1d5db'],
      },
    ],
  };
  return <Pie data={data} />;
}

export function IssuesTrend({ scans }) {
  const labels = scans.map(s => new Date(s.completedAt).toLocaleDateString());
  const data = {
    labels,
    datasets: [
      {
        label: 'Issues Over Time',
        data: scans.map(s => (s.issues ? s.issues.length : 0)),
        backgroundColor: '#60a5fa',
      },
    ],
  };
  return <Bar data={data} />;
}
