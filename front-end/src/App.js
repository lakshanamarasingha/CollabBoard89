import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import CreateBoardModal from './components/CreateBoardModal';
import { socket } from './socket';

function App() {
  // Session State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');
  const [isRegistering, setIsRegistering] = useState(false);

  // App Data State
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);

  // Form & Filter State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Verify session on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    const savedToken = sessionStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    } else {
      handleLogout();
    }
  }, []);

  // 2. Fetch Tasks whenever token or activeBoard changes
  useEffect(() => {
    if (!token) return;

    // Instantly wipe tasks so previous board's tasks don't linger during fetch
    setTasks([]);

    const boardQuery = activeBoard?._id ? `?boardId=${activeBoard._id}` : '';

    fetch(`http://localhost:5000/api/tasks${boardQuery}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.status === 401 ? handleLogout() : res.json()))
      .then((data) => {
        if (Array.isArray(data)) setTasks(data);
      })
      .catch((err) => console.error('Fetch tasks error:', err));
  }, [token, activeBoard]);

  // 3. Fetch User Boards & Set up Socket listeners
  useEffect(() => {
    if (!token) return;

    // Fetch User Boards
    fetch('http://localhost:5000/api/boards', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBoards(data);
      })
      .catch((err) => console.error('Fetch boards error:', err));

    // Connect Socket.io
    socket.connect();

    socket.on('task:created', (newTask) => {
      setTasks((prev) => {
        const exists = prev.some((t) => t._id === newTask._id);
        if (exists) return prev;
        return [...prev, newTask];
      });
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

  // Auth Handlers
  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    sessionStorage.clear();
    localStorage.clear();
  };

  // Task CRUD Handlers
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const initialStatus = columns[0] || 'To Do';

    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          status: initialStatus,
          boardId: activeBoard?._id || null
        })
      });

      if (res.ok) {
        setNewTitle('');
        setNewDescription('');
      }
    } catch (err) {
      console.error('Network error adding task:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    setTasks((prev) => prev.filter((task) => task._id !== id));

    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Board Creation Callback
  const handleBoardCreated = (newBoard) => {
    setBoards((prev) => [...prev, newBoard]);
    setActiveBoard(newBoard);
  };

  // Active Columns based on Board State
  const columns = activeBoard?.columns || ['To Do', 'Doing', 'Done'];

  // Safe Board Task Filtering Logic
  const filteredTasks = tasks.filter((t) => {
    // Check if task belongs to active board (or default null board)
    const activeId = activeBoard?._id ? String(activeBoard._id) : null;
    const taskBoardId = t.boardId ? String(t.boardId) : null;
    const belongsToCurrentBoard = taskBoardId === activeId;

    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return belongsToCurrentBoard && matchesSearch && matchesStatus;
  });

  // Render Authentication Views
  if (!user || !token) {
    return isRegistering ? (
      <Register onRegister={handleLogin} onSwitchToLogin={() => setIsRegistering(false)} />
    ) : (
      <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{ padding: '8px 16px', backgroundColor: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              + Create New Board
            </button>

            {boards.length > 0 && (
              <select
                value={activeBoard?._id || ''}
                onChange={(e) => setActiveBoard(boards.find((b) => b._id === e.target.value) || null)}
                style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
              >
                <option value="">Default Board</option>
                {boards.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
            >
              <option value="All">All Statuses</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Creation Form */}
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
            + Add Task
          </button>
        </form>

        {/* Dynamic Kanban Board Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: '16px' }}>
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col);
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
                        {columns.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
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

      {/* Pop-up Board Creation Modal Overlay */}
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBoardCreated={handleBoardCreated}
        token={token}
      />
    </div>
  );
}

export default App;