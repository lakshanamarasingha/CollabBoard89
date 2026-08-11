JavaScript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['To Do', 'Doing', 'Done'], default: 'To Do' },
  assignedTo: { type: String, default: 'Unassigned' }
}, { timestamps: true });
module.exports = mongoose.model('Task', taskSchema);
