const express = require('express');
const mongoose = require('mongoose');

const Todo = require('../models/todo');

module.exports = function(app) {

  const router = express.Router();

  // POST /todos
  router.post('/', (req, res, next) => {
    new Todo(req.body).save().then(savedTodo => {
      res
        .status(201)
        .set('Location', `${app.get('baseUrl')}/todos/${savedTodo._id}`)
        .send(savedTodo)
    }).catch(next);
  });

  // GET /todos
  router.get('/', (req, res, next) => {
    Todo.find().sort('createdAt').then(todos => res.send(todos));
  });

  // GET /todos/:id
  router.get('/:id', fetchTodo, (req, res, next) => {
    res.send(todo);
  });

  // PATCH /todos/:id
  router.patch('/:id', fetchTodo, (req, res, next) => {
    req.todo.set(req.body);
    req.todo.save().then(savedTodo => {
      res.send(savedTodo);
    }).catch(next);
  });

  // DELETE /todos/:id
  router.delete('/:id', fetchTodo, (req, res, next) => {
    req.todo.remove().then(() => res.sendStatus(204)).catch(next);
  });

  // Error handler
  router.use((err, req, res, next) => {

    const body = {
      message: err.message
    };

    if (err.name === 'ValidationError') {
      err.status = 422;
      body.message = 'Validation failed';
      body.errors = err.errors;
    }

    res.status(err.status || 500);
    res.send(body);
  });

  return router;
};

function fetchTodo(req, res, next) {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.sendStatus(404);
  }

  Todo.findById(id).then(todo => {
    if (!todo) {
      return res.sendStatus(404);
    }

    req.todo = todo;
    next();
  }).catch(next);
}
