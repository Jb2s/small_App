<template>
  <div class="p-5">
    <button class="mb-3 rounded-md px-3 py-1 bg-red-600 text-white font-bold" v-if="isEditing" @click="handleSuspendEditTask">X</button>
    <div :class="['add-task-form', 'bg-gray-100', 'border', 'border-gray-300', 'rounded-lg', 'p-5', 'mb-4', 'shadow-sm', 'w-full', 'mx-auto',
           { 'editing': isEditing }]" class="max-w-4xl mb-2">
      <input 
        v-model="newTask.title" 
        placeholder="Ajouter une todo à votre tâche" 
        class="border border-gray-300 p-2 rounded w-full" 
      />
      <textarea 
        v-model="newTask.description" 
        placeholder="Description de la tâche" 
        class="border border-gray-300 p-2 rounded w-full mt-3" 
      ></textarea>
      <div class="mt-2">
        <div v-for="(subTask, index) in newTask.subtasks" :key="index" class="mb-3">
          <input 
            v-model="subTask.title" 
            placeholder="Sous tâche" 
            class="border border-gray-300 p-2 rounded w-full" 
          />
        </div>
        
        <div class="flex space-x-3 w-full"> 
          <button 
            @click="handleAddDetailTask" 
            class="bg-blue-500 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-600 transition flex-[0.4]" 
          >
            Ajouter une todo
          </button>
          <button @click="handleSaveNewTask" 
            class="bg-green-500 text-white text-sm px-4 py-2 rounded-full hover:bg-green-600 transition flex-[0.6]" 
          >
            Sauvegarder
          </button>
          <!-- <button v-if = "isEditing"
            @click="handleEditTask" 
            class="bg-blue-500 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-600 transition flex-[0.4]" 
          >
            Editer la tache
          </button>
          <button v-if = "isEditing" 
            @click="handleSuspendEditTask" 
            class="bg-green-500 text-white text-sm px-4 py-2 rounded-full hover:bg-green-600 transition flex-[0.6]" 
          >
            Suspendre l'édition
          </button> -->
          
        </div>
      </div>
    </div>

    <div class="task-list bg-gray-100 border border-gray-300 rounded-lg p-5 shadow-sm w-full mx-auto">
      <h1 class="text-lg font-bold mb-4 text-center text-gray-800">Liste des Tâches</h1>
      <div v-if="taskStore.taskList.length">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(task, index) in taskStore.taskList" :key="task.id" class="mb-4">
            <TodoTask 
              :item="task" 
              @clickOnTask="openModal(task)"
              @edit="loadEditTask"
              @remove="removeTaskFromList"

            />
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
      @toggle="loadTasks"
      @remove="removeSubTaskFromList"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { addTaskWithSubTasks, getUserTasks, updateSubTasks } from '@/services/taskServices';
import { manageErrorCodeTaskAndSubtask } from '@/Utils/manageUtils';
import TodoTask from '@/components/TodoTask.vue'; 
import Modal from '@/components/Modal.vue'; 
import { useTaskStore } from '@/stores/taskStore';

const authStore = useAuthStore();
const newTask = ref({ title: '', description: '', subtasks: [{ title: '' }] });
const tasks = ref([]); 
const selectedTask = ref(null);
const isModalOpen = ref(false);
const editingTask = ref([]);
const isEditing = ref(false);
const taskStore = useTaskStore();

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
    subtasks: newTask.value.subtasks.map(item => ({ 
      "id": item.id,
      "title": item.title,
      "completed": item.completed,
      "taskId": item.taskId
    }))
  }

  console.log("payload", payload)
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
const removeSubTaskFromList = (taskId, subtaskId) => {
  const task = taskStore.taskList.find(t => t.id === taskId); 
    if (task) {
      task.subtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId); 
    }
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
