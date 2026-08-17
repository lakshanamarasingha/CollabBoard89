import React from 'react';
import Column from './Column';

function Board({ tasks, onMoveTask, onDeleteTask }) {
  const statuses = ['To Do', 'Doing', 'Done'];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '16px'
      }}
    >
      {statuses.map((status) => (
        <Column
          key={status}
          title={status}
          tasks={tasks.filter((task) => task.status === status)}
          onMoveTask={onMoveTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}

export default Board;