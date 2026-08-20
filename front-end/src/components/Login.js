import React, { useState } from 'react';

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      onLogin(data.user, data.token);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: '360px',
        margin: '60px auto',
        padding: '24px',
        border: '1px solid #cbd5e0',
        borderRadius: '8px'
      }}
    >
      <h2>Login to CollabBoard</h2>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '12px'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px'
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#3182ce',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Login
        </button>
      </form>

      <p
        style={{
          marginTop: '12px',
          textAlign: 'center'
        }}
      >
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: '#3182ce',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;