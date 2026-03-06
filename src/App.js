import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = "https://pc-api.boomin.net";

function App() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('Ready for connection test.');

  useEffect(() => {
    const saved = localStorage.getItem("access_token");
    if (saved) setToken(saved);
  }, []);

  function saveToken() {
    const trimmed = token.trim();
    if (trimmed) {
      localStorage.setItem("access_token", trimmed);
      setStatus("Token saved locally.");
    }
  }

  async function pingBackend() {
    const savedToken = localStorage.getItem("access_token");

    if (!savedToken) {
      setStatus("Error: Save a token first.");
      return;
    }

    setStatus("Pinging...");

    try {
      const response = await fetch(`${BACKEND_URL}/ping`, {
        headers: { "Authorization": `Bearer ${savedToken}` }
      });

      if (response.status === 401) {
        setStatus("Error: Invalid token.");
        return;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setStatus(`✓ ${data.message}`);

    } catch (error) {
      setStatus("Failed: Backend unreachable.");
    }
  }

  return (
    <div className="App">
      <h2>Agent Interface</h2>
      <input
        type="password"
        placeholder="Enter access token"
        autoComplete="off"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={saveToken}>Save Token</button>
      <button onClick={pingBackend}>Ping Backend</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
