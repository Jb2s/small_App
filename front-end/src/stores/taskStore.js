import { defineStore } from 'pinia';

export const useTaskStore = defineStore('taskList', {
  state: () => ({
    taskList: [],
    sharedTaskList: [],
    allCommentsToTask: [],
    selectedTask: null,
    isMine: true,
    percentage: 0, 
  }),
  actions: {

    addTask(task, todoList){
      console.log('addTask')
      this.taskList.push({
        id: task.id, 
        title: task.title,
        description: task.description, 
        completed: task.completed, 
        subTasks: todoList,
        userId: task.userId
      });
      console.log('new task list after add task' , this.taskList )
    },
    setTaskList(taskList) {
      console.log('setTaskList')
      this.taskList = taskList
      console.log('taskList after set task list', taskList)
      this.CalculateCompletionPercentage();

    },
    setCommentsToTask(comments) {
      this.allCommentsToTask = Array.isArray(comments) ? [...comments] : [];
      console.log('this.allCommentsToTask in store', this.allCommentsToTask)
      // console.log('taskList after set task list', comments)
      // this.CalculateCompletionPercentage();
    },
    updateTask(taskId, todoList) {
      console.log('updateTask')
      this.taskList.forEach(task => {
        if (task.id == taskId) {
          task.completed = true; 
          task.subTasks.forEach((item, index) => {
            if (item.id == todoList.id) {
              task.subTasks[index] = todoList; 
            }
          });
          const allSubtasksCompleted = task.subTasks.every(s => s.completed);
          task.completed = allSubtasksCompleted;
          this.selectedTask = task; 
          console.log('Tâche mise à jour:', this.selectedTask);
          this.CalculateCompletionPercentage();

        }
      });
    },
    updateSubtaskList(taskData, todoList) {
      console.log('updateSubtaskList')
      this.taskList.forEach(task => {
        if(task.id == taskData.id){
          task.completed = taskData.completed;
          task.subTasks.forEach((item, index) => {
            if (item.id == todoList.id) {
              task.subTasks[index] = todoList; 
            }
          });          
          this.selectedTask = task;
          console.log('updateSubtaskList', this.selectedTask)
        }
      });
      console.log('TaskStore.OUT', this.taskList)
      this.CalculateCompletionPercentage();

    },
    setSelectedTask(task) {
      console.log('setSelectedTask')
      this.selectedTask = task;
    },
    CalculateCompletionPercentage() {
      console.log('CalculateCompletionPercentage')
      const totalTasks = this.taskList.length; 
      const completedTasks = this.taskList.filter(t => t.completed == true).length;
      this.percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
      this.percentage = Math.round(this.percentage * 100) / 100;
    },

    deleteTask(taskId) {
      console.log('deleteTask')
      this.taskList = this.taskList.filter(t => t.id !== taskId);
      this.CalculateCompletionPercentage();
    },

    deleteSubTask(taskId,subtaskId){
      console.log('deleteSubTask')
      const task = this.taskList.find(t => t.id === taskId);
      if (task) {
        task.subTasks = task.subTasks.filter(s => s.id !== subtaskId);
        this.selectedTask = { ...task };
        this.CalculateCompletionPercentage();
    
      }
    },
    shareTask(taskId){
      this.taskList.forEach(task => {
        if (task.id == taskId) {
          task.isShared = true; 
        }
      });
    },
    setSharedTaskList(s_taskList) {
      this.sharedTaskList = JSON.parse(JSON.stringify(s_taskList));
      console.log('setSharedTaskList', this.sharedTaskList);
    },
    addSharedTask(task, todoList){
      console.log('addSharedTask');
      this.sharedTaskList.push({
        id: task.id, 
        title: task.title,
        description: task.description, 
        completed: task.completed, 
        subTasks: todoList,
        userId: task.userId
      });
      console.log('new task list after add task' , this.taskList )
    },
  },
  getters: {
    getPercentage: (state) => state.percentage,
  },
});
