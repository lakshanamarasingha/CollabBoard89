import React, { useState } from 'react';

function TaskForm({ onAddTask }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    onAddTask({
      title,
      description,
      assignedTo: assignedTo || 'Unassigned',
      status: 'To Do'
    });

    setTitle('');
    setDescription('');
    setAssignedTo('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor: '#3182ce',
          color: '#ffffff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        + Add New Task
      </button>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #cbd5e0',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '300px'
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
        Create New Task
      </h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '4px',
            border: '1px solid #cbd5e0',
            boxSizing: 'border-box'
          }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '4px',
            border: '1px solid #cbd5e0',
            boxSizing: 'border-box'
          }}
        />

        <input
          type="text"
          placeholder="Assign To (Name)"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '12px',
            borderRadius: '4px',
            border: '1px solid #cbd5e0',
            boxSizing: 'border-box'
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #cbd5e0',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#3182ce',
              color: '#fff',
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