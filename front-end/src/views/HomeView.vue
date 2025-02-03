<template>
  <div class="p-5">

    <button class="mb-3 rounded-lg px-3 py-1 bg-red-500 text-white font-bold" v-if="isEditing" @click="handleSuspendEditTask">
      <i class="fas fa-times"></i> 
    </button>

    <div :class="['add-task-form', 'bg-gray-100', 'border', 'border-gray-300', 'rounded-lg', 'p-5', 'mb-4', 'shadow-sm', 'w-full', 'mx-auto',
           { 'editing': isEditing }]" class="max-w-4xl mb-2">
      <label for="tâche" class="block text-sm font-medium text-gray-700">Tâche</label>

      <input 
        v-model="newTask.title" 
        class="border border-indigo-100 p-2 rounded w-full focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none'," 
      />

      <label for="Description" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea 
        v-model="newTask.description" 
        class="border border-indigo-100 p-2 rounded w-full mt-3 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none'," 
      />

      <div class="mt-2">
        <div v-for="(subTask, index) in newTask.subTasks" :key="index" class="mb-3">
          <label for="Sous tâche" class="block text-sm font-medium text-gray-700">Sous tâche</label>
          <input 
            v-model="subTask.title" 
            class="border border-indigo-100 p-2 rounded w-full focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
        
        <div class="flex space-x-3 w-full"> 
          <button @click="handleAddDetailTask" class="bg-indigo-200 text-indigo-900 text-sm font-medium px-4 py-2 rounded-sm hover:bg-indigo-300 transition flex-[0.4]" >
            Ajouter une todo
          </button>
          <button @click="handleSaveNewTask" 
            class="bg-indigo-200 text-indigo-900 font-medium text-sm px-4 py-2 rounded-sm hover:bg-indigo-300 transition flex-[0.6]" >
            Sauvegarder
          </button>
        </div>

      </div>
    </div>

    <div class="task-list bg-gray-100 border border-gray-300 rounded-lg p-5 shadow-sm w-full mx-auto">
      <div class="flex flex-col items-center mb-4">
        <h1 class="text-lg font-bold text-gray-800">Liste des Tâches ({{ per }}% Complètes)</h1>
        <div class="w-40 bg-yellow-200 rounded-full h-1.5 mt-2">
          <div class="bg-green-300 h-1.5 rounded-full" :style="{ width: per + '%', transition: 'all 0.3s ease' }"></div>
        </div>
    </div>

      <div v-if="taskStore.taskList.length">
        <div class=" justify-center">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="(task) in taskStore.taskList" :key="task.id" class="mb-4">
              <TodoTask 
                :item="task" 
                @clickOnTask="openModal(task)"
                @edit="loadEditTask"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-tasks text-center">
        <img class="task-image max-w-full h-auto" src="@/assets/koala.png" alt="Image" />
        <p>Aucune tâche disponible.</p>
      </div>
    </div>
    <Modal 
      v-if="isModalOpen" 
      :task="taskStore.selectedTask" 
      @close="closeModal" 
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount  } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { addTaskWithSubTasks, getUserTasks, updateTaskWithSubTasks } from '@/services/taskServices';
import { manageErrorCodeTaskAndSubtask } from '@/Utils/manageUtils';
import TodoTask from '@/components/Task.vue'; 
import Modal from '@/components/Modal.vue'; 
import { useTaskStore } from '@/stores/taskStore';

const authStore = useAuthStore();
const newTask = ref({ title: '', description: '', subTasks: [{ title: '' }] });
const isModalOpen = ref(false);
const isEditing = ref(false);
const taskStore = useTaskStore();
const per = computed(() => taskStore.getPercentage);
const openModal = (task) => {
  console.log('task', task)
  const st = { ...Array.from(taskStore.taskList).find(t => t.id === task.id)}
  console.log('st', st)
  taskStore.selectedTask = task;
  isModalOpen.value = true; 
};

const closeModal = () => {
  isModalOpen.value = false; 
};

const handleAddDetailTask = () => {
  const lastSubTask = newTask.value.subTasks.at(-1);
  console.log('lastSubTask', lastSubTask)
  if (!lastSubTask || !lastSubTask.title.trim()) {
    console.log("La dernière sous-tâche est vide. Veuillez la remplir avant d'ajouter une nouvelle sous-tâche.");
    return;
  } else {
    newTask.value.subTasks.push({ title: '' });
  }
};

const handleSaveNewTask = async () => {
  if (!newTask.value.title.trim()) return;
  console.log('newTask >> ', newTask.value.taskId);
  const token = authStore.getToken;
  if (!token) return console.error('Token non trouvé');
  const payload = {
    taskId: newTask.value.taskId,
    title: newTask.value.title,
    description: newTask.value.description,
    isShared: newTask.value.isShared,
    subTasks: newTask.value.subTasks
    .filter(item => item.title && item.title.trim() !== '')
    .map(item => ({ 
      "id": item.id,
      "title": item.title,
      "completed": item.completed,
      "taskId": item.taskId
    }))
  }
  console.log("new Task",newTask)
  console.log("payload", payload)
  try {
    let response = null;
    if(!isEditing.value){
      response = await addTaskWithSubTasks(payload, token);
      console.log('responseAdd',response)
      taskStore.addTask(response.task, response.subTask)
      loadTasks()
      console.log('SAVE ACTION');
    } else {
      console.log('UPDATE ACTION');
      response = await updateTaskWithSubTasks(payload, token);
      taskStore.updateSubtaskList(response.task, response.todoList)
      console.log('after update action', response)
    }

    if(response){
      loadTasks();
      resetNewTask();
    }
    
  } catch (error) {
    const errorResponse = manageErrorCodeTaskAndSubtask(error.code, error.message);
    console.error('handleSaveNewTask.error >> ', error);
    console.log(errorResponse.message);
  } finally {
    isEditing.value = false;
    await loadTasks()
    taskStore.CalculateCompletionPercentage();
    resetNewTask();
  }
};

const loadEditTask = (id) => {
  const launchTask =  {... Array.from(taskStore.taskList).find(t => t.id === id)};
  const todoList = launchTask.subTasks.map(item => {
    return {
      "id": item.id,
      "title": item.title,
      "completed": item.completed,
      "taskId": item.taskId
    }
  })
  launchTask.subTasks = todoList;
  console.log('launchTask', launchTask);
  if (launchTask) {
    newTask.value.title = launchTask.title;
    newTask.value.description = launchTask.description;
    newTask.value.subTasks = launchTask.subTasks.length == 0 ? [{ title: '' }] : launchTask.subTasks;
    newTask.value.taskId = launchTask.id;
    isEditing.value = true;
  }
};

const handleSuspendEditTask = () => {
  isEditing.value = false;

  resetNewTask();
};

const loadTasks = async () => {
  console.log('loadTasks');
   const token = authStore.getToken;
   if (token) {
       try {
          const result = await getUserTasks(token);
          taskStore.setTaskList(result);
          console.log('result in front end', result)
          console.log('TASK STORE',  taskStore.taskList)
       } catch (error) {
           console.error('loadTasks.error >> ', error);
       }
   }
}

const resetNewTask = () => {
  newTask.value.title = '';
  newTask.value.description = '';
  newTask.value.subTasks = [{ title: '' }];
};
onMounted(async () => {
  await loadTasks();
  // socket.on('task_updated', loadTasks);
  // console.log('socket',socket);
});

onBeforeUnmount( async () => {

  await loadTasks();
});
</script>

<style scoped>
.add-task-form {
  transition: all 0.3s ease; 
}
.task-image {
   width: 80px; 
   height: auto; 
   border-radius: 0.5rem;
}
.editing {
  border-color: #38a169; 
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
  transition: all 0.3s ease; 
}
</style>
