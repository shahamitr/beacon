
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import Scans from './Scans';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Websites({ onSelectWebsite }) {
  const { token } = useAuth();
  const [websites, setWebsites] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  async function fetchWebsites() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/websites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch websites');
      setWebsites(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchWebsites();
    // eslint-disable-next-line
  }, [token]);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/websites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, url }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to add website');
      setName('');
      setUrl('');
      fetchWebsites();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      const res = await fetch(`${API_URL}/websites/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete website');
      fetchWebsites();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Websites</h2>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          className="flex-1 border px-3 py-2 rounded"
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="flex-1 border px-3 py-2 rounded"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Add
        </button>
      </form>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="divide-y">
          {websites.map(w => (
            <li
              key={w._id}
              className={`py-2 cursor-pointer ${selectedId === w._id ? 'bg-blue-50' : ''}`}
              onClick={() => {
                setSelectedId(w._id);
                if (onSelectWebsite) onSelectWebsite(w._id);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{w.name}</div>
                  <div className="text-sm text-gray-600">{w.url}</div>
                </div>
                <button
                  className="text-red-600 hover:underline text-sm"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(w._id);
                  }}
                >
                  Delete
                </button>
              </div>
              <Scans websiteId={w._id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
