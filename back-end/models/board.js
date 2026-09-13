const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  columns: {
    type: [String],
    default: ['To Do', 'Doing', 'Done']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Board', BoardSchema);