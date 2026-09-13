import React, { useState } from 'react';

function CreateBoardModal({ isOpen, onClose, onBoardCreated, token }) {
  const [boardName, setBoardName] = useState('');
  const [columns, setColumns] = useState(['To Do', 'Doing', 'Done']);
  const [newColumn, setNewColumn] = useState('');
  const [loading, setLoading] = useState(false);

  // Guard clause: Return nothing if modal isn't active
  if (!isOpen) return null;

  const handleAddColumn = () => {
    if (!newColumn.trim()) return;
    if (columns.includes(newColumn.trim())) return;
    setColumns([...columns, newColumn.trim()]);
    setNewColumn('');
  };

  const handleRemoveColumn = (colToRemove) => {
    setColumns(columns.filter((col) => col !== colToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: boardName,
          columns: columns.length > 0 ? columns : ['To Do', 'Doing', 'Done']
        })
      });

      const data = await res.json();

      if (res.ok) {
        onBoardCreated(data);
        onClose();
        setBoardName('');
        setColumns(['To Do', 'Doing', 'Done']);
      } else {
        console.error('Server error:', data.message);
      }
    } catch (err) {
      console.error('Network error creating board:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>Create New Board</h2>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Board Name</label>
            <input
              type="text"
              placeholder="e.g., Q3 Marketing Campaign"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Columns</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="Add custom column..."
                value={newColumn}
                onChange={(e) => setNewColumn(e.target.value)}
                style={{ ...styles.input, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAddColumn}
                style={styles.secondaryBtn}
              >
                + Add
              </button>
            </div>

            <div style={styles.tagContainer}>
              {columns.map((col) => (
                <span key={col} style={styles.tag}>
                  {col}
                  <button
                    type="button"
                    onClick={() => handleRemoveColumn(col)}
                    style={styles.removeTagBtn}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#a0aec0'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#2d3748'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #cbd5e0',
    boxSizing: 'border-box'
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px'
  },
  tag: {
    backgroundColor: '#e2e8f0',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  removeTagBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#e53e3e',
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  },
  secondaryBtn: {
    padding: '8px 12px',
    backgroundColor: '#edf2f7',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: '#transparent',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '8px 16px',
    backgroundColor: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default CreateBoardModal;