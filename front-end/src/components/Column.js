import React from 'react';
import TaskCard from './TaskCard';

function Column({ status, title, tasks = [], onMoveTask, onDeleteTask }) {
  const columnTitle = status || title;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#ebf8ff',
        border: '1px solid #cbd5e0',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '280px',
        minHeight: '500px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '18px', color: '#2b6cb0' }}>
          {columnTitle}
        </h2>
        <span
          style={{
            backgroundColor: '#bee3f8',
            color: '#2b6cb0',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {tasks.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onMoveTask={onMoveTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default Column;