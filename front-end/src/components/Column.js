import React from 'react';
import TaskCard from './TaskCard';

function Column({ status, tasks, onMoveTask, onDeleteTask }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#ebf8ff',
        padding: '16px',
        borderRadius: '8px',
        minHeight: '500px'
      }}
    >
      <h2
        style={{
          fontSize: '18px',
          marginBottom: '16px',
          color: '#2b6cb0'
        }}
      >
        {status} ({tasks.length})
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
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