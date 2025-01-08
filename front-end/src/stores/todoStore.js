import { defineStore } from 'pinia';
import { generateTodoListId,generateTodoTaskId } from '@/mocks/mocks';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    currentUser: null, 
  }),
  actions: {
    loadTodos() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      this.currentUser = users.find(user => user.is_authenticated);
      this.todos = this.currentUser ? this.currentUser.todoList : []; 
    },
    addTodo(title, description) {
        if (!this.currentUser) return;
  
        const newTodo = {
          id: generateTodoListId(), 
          title,
          description,
          status: false,
          todoTask: [],
        };
        
        this.todos.push(newTodo);
        this.updateLocalStorage(); 
        return newTodo.id; 
      },
      addTodoTask(todoId, title) {
        const todo = this.todos.find(t => t.id === todoId);
        if (todo) {
          const newTodoTask = {
            id: generateTodoTaskId(), 
            titre: title,
            completed: false, 
          };
          todo.todoTask.push(newTodoTask); 
          this.updateLocalStorage(); 
        }
      },
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.status = !todo.status;
        this.updateLocalStorage();
      }
    },
    deleteTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id);
      this.updateLocalStorage();
    },
    toggleTodoTask(todoId, taskId) {
      const todo = this.todos.find(t => t.id === todoId);
      if (todo) {
        const task = todo.todoTask.find(t => t.id === taskId);
        if (task) {
          task.completed = !task.completed; 
          this.updateLocalStorage();
        }
      }
    },
    deleteTodoTask(todoId, taskId) {
      const todo = this.todos.find(t => t.id === todoId);
      if (todo) {
        todo.todoTask = todo.todoTask.filter(t => t.id !== taskId); 
        this.updateLocalStorage();
      }
    },
    updateLocalStorage() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (this.currentUser) {
        const index = users.findIndex(user => user.id === this.currentUser.id);
        if (index !== -1) {
          users[index].todoList = this.todos; 
          localStorage.setItem('users', JSON.stringify(users)); 
        }
      }
    },
  },
});
