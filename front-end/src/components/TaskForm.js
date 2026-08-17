import React, { useState } from 'react';

function TaskForm({ onAddTask, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('To Do');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    onAddTask({
      title,
      description,
      assignedTo: assignedTo || 'Unassigned',
      status: status || 'To Do'
    });

    // Reset form fields
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setStatus('To Do');

    if (onClose) onClose();
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
        justify: 'center',
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
          width: '350px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>Create Task</h2>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #cbd5e0',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #cbd5e0',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
            Assign To
          </label>
          <input
            type="text"
            placeholder="Name (optional)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #cbd5e0',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
            Initial Column
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #cbd5e0',
              boxSizing: 'border-box'
            }}
          >
            <option value="To Do">To Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 12px',
              border: '1px solid #cbd5e0',
              background: '#fff',
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
              cursor: 'pointer',
              fontWeight: 'bold'
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