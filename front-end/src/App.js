import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import { socket } from './socket';

function App() {
  // Switch from localStorage to sessionStorage
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');
  const [isRegistering, setIsRegistering] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // 1. Verify saved login session on mount (sessionStorage)
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    const savedToken = sessionStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    } else {
      handleLogout();
    }
  }, []);

  // 2. Fetch initial tasks & subscribe to Socket.io events when logged in
  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:5000/api/tasks', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 401) {
          handleLogout();
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setTasks(data);
      })
      .catch((err) => console.error('Fetch tasks error:', err));

    socket.connect();

    socket.on('task:created', (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on('task:updated', (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    });

    socket.on('task:deleted', (deletedId) => {
      setTasks((prev) => prev.filter((t) => t._id !== deletedId));
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
      socket.disconnect();
    };
  }, [token]);

  // Auth Handlers using sessionStorage
  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    // Clear out any old persistent localStorage items as well
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // CRUD API Handlers
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: newTitle, 
          description: newDescription, 
          status: 'To Do' 
        })
      });

      const createdTask = await res.json();

      if (res.ok) {
        setTasks((prev) => [...prev, createdTask]);
        setNewTitle('');
        setNewDescription('');
      } else {
        console.error('Server error:', createdTask.message);
      }
    } catch (err) {
      console.error('Network error adding task:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update status on server');
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
  // 1. Optimistically remove from React state immediately
  setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

  try {
    // 2. Send DELETE request to Backend API
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Failed to delete task on server');
    }
  } catch (err) {
    console.error('Error deleting task:', err);
    // Optional: Fetch tasks again if backend deletion failed to restore state
  }
};

  // Unauthenticated Views
  if (!user || !token) {
    return isRegistering ? (
      <Register onRegister={handleLogin} onSwitchToLogin={() => setIsRegistering(false)} />
    ) : (
      <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />
    );
  }

  const columns = ['To Do', 'Doing', 'Done'];

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Task Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            style={{ padding: '8px 12px', flex: '1', borderRadius: '4px', border: '1px solid #cbd5e0' }}
          />
          <input
            type="text"
            placeholder="Description (optional)..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            style={{ padding: '8px 12px', flex: '2', borderRadius: '4px', border: '1px solid #cbd5e0' }}
          />
          <button
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add New Task
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col);
            return (
              <div
                key={col}
                style={{ backgroundColor: '#ebf8ff', padding: '16px', borderRadius: '8px', minHeight: '400px' }}
              >
                <h3 style={{ marginTop: 0, color: '#2b6cb0' }}>
                  {col} ({columnTasks.length})
                </h3>
                {columnTasks.map((task) => (
                  <div
                    key={task._id}
                    style={{ backgroundColor: '#fff', padding: '12px', marginBottom: '12px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  >
                    <h4 style={{ margin: '0 0 6px 0' }}>{task.title}</h4>
                    {task.description && <p style={{ fontSize: '13px', color: '#4a5568', margin: '0 0 12px 0' }}>{task.description}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px' }}
                      >
                        <option value="To Do">To Do</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                      </select>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;