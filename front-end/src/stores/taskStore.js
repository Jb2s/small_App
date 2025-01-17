import { defineStore } from 'pinia';

export const useTaskStore = defineStore('todoList', {
  state: () => ({
    taskList: [],
    selectedTask: null,
    percentage: null, 
  }),
  actions: {
    
    setTaskList(taskList) {
      this.taskList = taskList;
      console.log('taskList after set task list', taskList)
      this.CalculateCompletionPercentage();

    },
    updateTask(taskId, todoList) {
      this.taskList.forEach(task => {
        if (task.id == taskId) {
          task.completed = true; 
          task.subtasks.forEach((item, index) => {
            if (item.id == todoList.id) {
              task.subtasks[index] = todoList; 
            }
          });
          const allSubtasksCompleted = task.subtasks.every(subtask => subtask.completed);
          task.completed = allSubtasksCompleted; 
          console.log('Tâche mise à jour:', task);
          this.CalculateCompletionPercentage();

        }
      });
    },
    updateSubtaskList(taskData, todoList) {
      this.taskList.forEach(task => {
        if(task.id == taskData.id){
          task.completed = taskData.completed;
          task.subtasks = todoList;
        }
      });
      console.log('TaskStore.OUT', this.taskList)
      this.CalculateCompletionPercentage();

    },
    setSelectedTask(task) {
      this.selectedTask = task;
    },
    CalculateCompletionPercentage() {
      const totalTasks = this.taskList.length; 
      const completedTasks = this.taskList.filter(task => task.completed == true).length;
      console.log('UPDATE DATA', this.taskList) 
      console.log('UPDATE LENGTH', this.taskList.length)
      console.log('completedTasks', this.taskList.filter(task => task.completed == true).length)
      console.log('NONE completedTasks', this.taskList.filter(task => task.completed == false).length)

      this.percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
      console.log('percentage',this.percentage);
      this.percentage = Math.round(this.percentage * 100) / 100;
  },
  deleteTask(taskId) {
    this.taskList = this.taskList.filter(task => task.id !== taskId);
    console.log(`Tâche avec l'ID ${taskId} supprimée.`);
    this.CalculateCompletionPercentage();

  },
  },
  getters: {
    getPercentage: (state) => state.percentage,
  },
});
