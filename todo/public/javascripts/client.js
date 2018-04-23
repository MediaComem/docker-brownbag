const app = new Vue({
  el: '#app',
  data: {
    title: 'TODO',
    initialized: false,
    newTodoText: '',
    todos: []
  },
  created: function() {
    this.$http.get('/todos').then(res => {
      this.todos = res.body;
    });
  },
  methods: {
    createTodo: function() {
      this.$http.post('/todos', { text: this.newTodoText }).then(res => {
        this.todos.push(res.body);
      });
    },
    destroyTodo: function(todo) {
      this.$http.delete(`/todos/${todo._id}`).then(res => {
        this.todos.splice(this.todos.indexOf(todo), 1);
      });
    }
  }
});
