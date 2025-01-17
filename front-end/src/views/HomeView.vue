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
        class="border border-gray-300 p-2 rounded w-full" 
      />
      <label for="Description" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea 
        v-model="newTask.description" 
        class="border border-gray-300 p-2 rounded w-full mt-3" 
      ></textarea>
      <div class="mt-2">
        <div v-for="(subTask, index) in newTask.subtasks" :key="index" class="mb-3">
          <label for="Sous tâche" class="block text-sm font-medium text-gray-700">Sous tâche</label>
          <input 
            v-model="subTask.title" 
            class="border border-gray-300 p-2 rounded w-full" 
          />
        </div>
        
        <div class="flex space-x-3 w-full"> 
          <button 
            @click="handleAddDetailTask" 
            class="bg-blue-500 text-white text-sm px-4 py-2 rounded-sm hover:bg-blue-600 transition flex-[0.4]" 
          >
            Ajouter une todo
          </button>
          <button @click="handleSaveNewTask" 
            class="bg-green-500 text-white text-sm px-4 py-2 rounded-sm hover:bg-green-600 transition flex-[0.6]" 
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>

    <div class="task-list bg-gray-100 border border-gray-300 rounded-lg p-5 shadow-sm w-full mx-auto">
      <div class="flex flex-col items-center mb-4">
        <h1 class="text-lg font-bold text-gray-800">Liste des Tâches ({{ per }}% Complètes)</h1>
        <div class="w-40 bg-yellow-200 rounded-full h-1.5 mt-2">
            <div class="bg-green-400 h-1.5 rounded-full" :style="{ width: per + '%' }"></div>
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
                @remove="removeTaskFromList"
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
import { ref, onMounted,computed  } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { addTaskWithSubTasks, getUserTasks, updateSubTasks } from '@/services/taskServices';
import { manageErrorCodeTaskAndSubtask } from '@/Utils/manageUtils';
import TodoTask from '@/components/Task.vue'; 
import Modal from '@/components/Modal.vue'; 
import { useTaskStore } from '@/stores/taskStore';

const authStore = useAuthStore();
const newTask = ref({ title: '', description: '', subtasks: [{ title: '' }] });
const selectedTask = ref(null);
const isModalOpen = ref(false);
const editingTask = ref([]);
const isEditing = ref(false);
const taskStore = useTaskStore();
const per = computed(() => taskStore.getPercentage);
const openModal = (task) => {
  selectedTask.value = task;
  isModalOpen.value = true; 
};

const closeModal = () => {
  isModalOpen.value = false; 
};

const handleAddDetailTask = () => {
  const lastSubTask = newTask.value.subtasks.at(-1);
  if (lastSubTask && lastSubTask.title.trim()) {
    newTask.value.subtasks.push({ title: '' }); 
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
    subtasks: newTask.value.subtasks
    .filter(item => item.title && item.title.trim() !== '')
    .map(item => ({ 
      "id": item.id,
      "title": item.title,
      "completed": item.completed,
      "taskId": item.taskId
    }))
  }
  console.log("payload", payload)
  console.log("percentage after new task", taskStore.CalculateCompletionPercentage())
  try {
    let response = null;
    if(!isEditing.value){
      response = await addTaskWithSubTasks(payload, token);
      console.log('SAVE ACTION');
    } else {
      console.log('UPDATE ACTION');
      response = await updateSubTasks(payload, token);
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
  const launchTask =  Array.from(taskStore.taskList).find(t => t.id === id);
  console.log('launchTask', launchTask.subtasks.length)
  if (launchTask) {
    newTask.value.title = launchTask.title;
    newTask.value.description = launchTask.description;
    newTask.value.subtasks = launchTask.subtasks.length == 0 ? [{ title: '' }] : launchTask.subtasks;
    newTask.value.taskId = launchTask.id;
    isEditing.value = true;
  }

  console.log('newTask', newTask.value);
  editingTask.value = {
    id: launchTask.id, 
    title: newTask.value.title,
    description: newTask.value.description,
    subtasks: newTask.value.subtasks
  };
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
          console.log('TASK STORE',  taskStore.taskList)
       } catch (error) {
           console.error('loadTasks.error >> ', error);
       }
   }
}


const removeTaskFromList = (id) => {
  taskStore.taskList = taskStore.taskList.filter(task => task.id !== id); 
};

const resetNewTask = () => {
  newTask.value.title = '';
  newTask.value.description = '';
  newTask.value.subtasks = [{ title: '' }];
};

onMounted(async () => {
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
