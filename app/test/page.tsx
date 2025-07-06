'use client';

import { useState } from 'react';

export default function TestPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('123456');
  const [token, setToken] = useState('');
  const [tickers, setTickers] = useState('AAPL,MSFT');
  const [history, setHistory] = useState<any[]>([]);
  const [params, setParams] = useState('{"periode":"3mois"}');

  const api = '/api';

  const request = async (path: string, method = 'POST', body?: any, auth = false) => {
    const res = await fetch(`${api}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();
    console.log(path, json);
    return json;
  };

  const register = async () => {
    await request('/auth/register', 'POST', { email, password });
  };

  const login = async () => {
    const res = await request('/auth/login', 'POST', { email, password });
    if (res.token) setToken(res.token);
  };

  const createRequest = async () => {
    await request('/reports/request', 'POST', {
      tickers: tickers.split(','),
      params: JSON.parse(params),
    }, true);
  };

  const loadHistory = async () => {
    const res = await request('/reports/history', 'GET', undefined, true);
    setHistory(res.reports || []);
  };

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">🧪 Test API – Finance WebApp</h1>

      <div className="space-y-2 border p-4 rounded-xl bg-gray-50">
        <h2 className="font-semibold">🔐 Auth</h2>
        <input
          className="border p-2 w-full"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="space-x-2">
          <button onClick={register} className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
          <button onClick={login} className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
        </div>
        {token && <p className="text-sm break-all">✅ Token: {token}</p>}
      </div>

      <div className="space-y-2 border p-4 rounded-xl bg-gray-50">
        <h2 className="font-semibold">📤 Créer une demande de rapport</h2>
        <input
          className="border p-2 w-full"
          placeholder="Tickers (ex: AAPL,MSFT)"
          value={tickers}
          onChange={(e) => setTickers(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder='Params (JSON ex: {"periode":"3mois"})'
          value={params}
          onChange={(e) => setParams(e.target.value)}
        />
        <button onClick={createRequest} className="bg-purple-500 text-white px-4 py-2 rounded">
          ➕ Envoyer
        </button>
      </div>

      <div className="space-y-2 border p-4 rounded-xl bg-gray-50">
        <h2 className="font-semibold">📥 Historique</h2>
        <button onClick={loadHistory} className="bg-gray-800 text-white px-4 py-2 rounded">
          🔄 Charger
        </button>
        <ul className="text-sm list-disc pl-6">
          {history.map((r) => (
            <li key={r.id}>
              {r.tickers} – {r.status} – {r.createdAt}
              {r.report?.filePath && (
                <a className="text-blue-600 ml-2 underline" href={`/${r.report.filePath}`} target="_blank">📄</a>
              )}
            </li>
          ))}
        </ul>
        <p className="text-sm break-all">✅ Token: {token}</p>

      </div>
    </div>
  );
}
