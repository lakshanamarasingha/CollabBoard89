import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import TaskForm from './components/TaskForm';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // GET: Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);


  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();

      setTasks(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };


  // POST: Create new task
  const handleAddTask = async (newTaskData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTaskData)
      });


      if (!response.ok) {
        throw new Error('Failed to create task');
      }


      const savedTask = await response.json();

      setTasks((prev) => [
        ...prev,
        savedTask
      ]);

      setIsFormOpen(false);


    } catch (err) {
      alert(`Error creating task: ${err.message}`);
    }
  };


  // PUT: Update task status
  const handleMoveTask = async (taskId, newStatus) => {
    try {

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });


      if (!response.ok) {
        throw new Error('Failed to update task');
      }


      const updatedTask = await response.json();


      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? updatedTask
            : task
        )
      );


    } catch (err) {
      alert(`Error moving task: ${err.message}`);
    }
  };


  // DELETE: Remove task
  const handleDeleteTask = async (taskId) => {
    try {

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE'
      });


      if (!response.ok) {
        throw new Error('Failed to delete task');
      }


      setTasks((prev) =>
        prev.filter((task) => task._id !== taskId)
      );


    } catch (err) {
      alert(`Error deleting task: ${err.message}`);
    }
  };


  return (
    <div
      style={{
        padding: '24px',
        fontFamily: 'sans-serif',
        backgroundColor: '#f7fafc',
        minHeight: '100vh'
      }}
    >

      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >

        <div>
          <h1
            style={{
              margin: 0,
              color: '#1a202c'
            }}
          >
            CollabBoard
          </h1>

          <p
            style={{
              margin: '4px 0 0',
              color: '#718096'
            }}
          >
            Live Express & MongoDB Integration
          </p>
        </div>


        <button
          onClick={() => setIsFormOpen(true)}
          style={{
            padding: '10px 18px',
            backgroundColor: '#3182ce',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Add New Task
        </button>

      </header>


      {error && (
        <div style={{ color: 'red', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}


      {isFormOpen && (
        <TaskForm
          onAddTask={handleAddTask}
          onClose={() => setIsFormOpen(false)}
        />
      )}


      {loading ? (
        <p>Loading tasks from server...</p>
      ) : (
        <Board
          tasks={tasks}
          onMoveTask={handleMoveTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

    </div>
  );
}

export default App;