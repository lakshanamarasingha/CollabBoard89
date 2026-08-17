import React, { useState } from 'react';

function TaskForm({ onAddTask, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    onAddTask({ title, description, status });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          width: '350px'
        }}
      >
        <h2 style={{ marginTop: 0 }}>Create Task</h2>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>
            Initial Column
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="To Do">To Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 12px',
              border: 'none',
              background: '#e2e8f0',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            style={{
              padding: '8px 12px',
              border: 'none',
              background: '#3182ce',
              color: '#fff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;