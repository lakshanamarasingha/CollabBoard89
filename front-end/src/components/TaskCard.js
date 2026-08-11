import React from 'react';

function TaskCard({ task, onMoveTask }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e0',
        borderRadius: '6px',
        padding: '14px',
        marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}
    >
      <h4
        style={{
          margin: '0 0 6px 0',
          fontSize: '15px',
          color: '#1a202c'
        }}
      >
        {task.title}
      </h4>

      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '13px',
          color: '#4a5568',
          lineHeight: '1.4'
        }}
      >
        {task.description || 'No description provided.'}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          paddingTop: '8px',
          borderTop: '1px solid #edf2f7'
        }}
      >
        <span
          style={{
            fontSize: '11px',
            backgroundColor: '#ebf8ff',
            color: '#2b6cb0',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          {task.assignedTo}
        </span>

        <select
          value={task.status}
          onChange={(e) => onMoveTask(task._id, e.target.value)}
          style={{
            fontSize: '12px',
            padding: '2px 4px',
            borderRadius: '4px',
            borderColor: '#cbd5e0'
          }}
        >
          <option value="To Do">To Do</option>
          <option value="Doing">Doing</option>
          <option value="Done">Done</option>
        </select>

      </div>
    </div>
  );
}

export default TaskCard;