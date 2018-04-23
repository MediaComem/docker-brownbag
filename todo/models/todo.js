const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Todo = new Schema({
  text: {
    type: String,
    maxlength: 50,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', Todo);
