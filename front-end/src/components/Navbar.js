import React from 'react';

function Navbar({ user, onLogout }) {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        backgroundColor: '#2b6cb0',
        color: '#fff'
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: '20px'
        }}
      >
        CollabBoard
      </h1>

      {user ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <span>
            Welcome, <strong>{user.name}</strong>
          </span>

          <button
            onClick={onLogout}
            style={{
              padding: '6px 12px',
              backgroundColor: '#e53e3e',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <span>Please log in to collaborate</span>
      )}
    </nav>
  );
}

export default Navbar;