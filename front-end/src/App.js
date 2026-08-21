import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import TaskForm from './components/TaskForm';
import socket from './socket';

// Initial Mock Data matching API Contract
const INITIAL_TASKS = [
  {
    _id: '1',
    title: 'Set up Repo',
    description: 'Initialize project structure',
    status: 'Done',
    assignedTo: 'Team'
  },
  {
    _id: '2',
    title: 'Build UI Components',
    description: 'Create React layout components',
    status: 'Doing',
    assignedTo: 'Front-End Sub-Team'
  },
  {
    _id: '3',
    title: 'Build Express API',
    description: 'Create REST endpoints',
    status: 'To Do',
    assignedTo: 'Back-End Sub-Team'
  }
];

function App() {

  // Client-side persistence: Load from localStorage or fall back to mock data
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('collabboard_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Sync state to localStorage on any task update
  useEffect(() => {
    localStorage.setItem('collabboard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Listen for real-time task creation
useEffect(() => {
  const handleTaskCreated = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  socket.on('taskCreated', handleTaskCreated);

  return () => {
    socket.off('taskCreated', handleTaskCreated);
  };
}, []);


  // Handler to add a new task
  const handleAddTask = (newTask) => {
    setTasks((prev) => [
      ...prev,
      {
        ...newTask,
        _id: Date.now().toString()
      }
    ]);
  };


  // Handler to update or move task status
  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId
          ? { ...t, status: newStatus }
          : t
      )
    );
  };


  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '16px'
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: '#1a202c' }}>
            CollabBoard
          </h1>

          <p
            style={{
              margin: '4px 0 0 0',
              color: '#718096',
              fontSize: '14px'
            }}
          >
            Real-time Kanban Task Management
          </p>
        </div>

        <TaskForm onAddTask={handleAddTask} />
      </header>

      <main>
        <Board
          tasks={tasks}
          onMoveTask={handleMoveTask}
        />
      </main>

    </div>
  );
}

export default App;