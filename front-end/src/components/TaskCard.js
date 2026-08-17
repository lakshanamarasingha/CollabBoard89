import React from 'react';

function TaskCard({ task, onMoveTask, onDeleteTask }) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '14px',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '16px'
        }}
      >
        {task.title}
      </h3>

      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          color: '#4a5568'
        }}
      >
        {task.description}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <select
          value={task.status}
          onChange={(e) =>
            onMoveTask(task._id, e.target.value)
          }
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #cbd5e0'
          }}
        >
          <option value="To Do">To Do</option>
          <option value="Doing">Doing</option>
          <option value="Done">Done</option>
        </select>

        <button
          onClick={() => onDeleteTask(task._id)}
          style={{
            color: '#e53e3e',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;