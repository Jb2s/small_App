import { updateSubTasks } from '@/services/taskServices';
import { defineStore } from 'pinia';

export const useTaskStore = defineStore('todo', {
  state: () => ({
    taskList: [],
    selectedTask: null, 
  }),
  actions: {
    loadTodos() {
      console.log('loadTodos from store');
    },
    setTaskList(taskList) {
      this.taskList = taskList;
    },
    updateTodo(taskId, todo) {
      this.taskList.forEach(task => {
        if(task.id === taskId){
          task.subtasks.forEach(item => {
            if(item.id === todo.id){
              item = todo;
            }
          });
        }
      });
    },
    updateTodoList(taskId, todoList) {
      this.taskList.forEach(task => {
        if(task.id === taskId){
          task.subtasks = todoList;
        }
      });
    },
    deleteTodo(taskId, todo) {
      this.taskList.forEach(task => {
        if(task.id === taskId){
          task.subtasks = task.subtasks.filter(item => item.id !== todo.id);
        }
      });
    },
    setSelectedTask(task) {
      this.selectedTask = task;
    }
  },
});
