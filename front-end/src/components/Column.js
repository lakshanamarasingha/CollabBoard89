JavaScript
import React from 'react';
import TaskCard from './TaskCard';

function Column({ title, tasks, onMoveTask }) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#f7fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      margin: '0 8px',
      minWidth: '280px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#2d3748' }}>{title}</h3>
        <span style={{ backgroundColor: '#e2e8f0', color: '#4a5568', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
          {tasks.length}
        </span>
      </div>

      <div>
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onMoveTask={onMoveTask} />
        ))}
      </div>
    </div>
  );
}
