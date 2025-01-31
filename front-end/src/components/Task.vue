<template>
  <div class="task-card flex bg-white border border-gray-300 rounded-lg shadow-md p-5 transition-shadow duration-200 hover:shadow-lg">
    <div class="task-content flex flex-col flex-grow">
      <span class="inline-block w-full px-2 py-1 text-md text-gray mb-2" 
            :class="{ 'bg-green-200 rounded-sm': props.item.completed, 'bg-yellow-200 rounded-sm': !props.item.completed }">
        <i>{{ props.item.completed ? 'Complète' : 'Planifiée' }}</i>
      </span>
      <h5  class="task-title text-lg text-gray-900 cursor-pointer" :class="{ 'line-through': props.item.completed }" @click="handleTaskClick"><i>{{ props.item.title }}</i></h5>
      <h6 class="task-title text-md text-gray-700 cursor-pointer" @click="handleTaskClick"><i>{{ props.item.description }}</i></h6>
      <p class="task-subtasks-count text-sm text-gray-600">
        <i>{{ props.item.subTasks && props.item.subTasks.length > 0 ? props.item.subTasks.length + ' sous tâche(s)' : 'Aucune tâche' }}</i>
      </p>
                <div class="flex justify-between items-center">
        <div class="task-actions">
          <p class="task-subtasks-count text-xs text-indigo-600"><i v-if="props.item.isShared">Partagée</i></p>
        </div>  
        <div v-if="iskTaskMine(props.item)" class="task-actions">
          
          <div v-if="!isCommunityRoute">
                      <div class="relative group">
            <button id="dropdownDefaultButton" class="text-indigo-900 bg-indigo-300 hover:bg-indigo-400 font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex items-center" type="button">
              Actions
              <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>

            <div class="absolute z-10 bg-white divide-y divide-indigo-100 rounded-sm shadow w-40 hidden group-hover:block">
              <ul class="py-2 text-sm text-gray-700">
                <li>
                  <button @click.stop="handleToggleTask" class=" w-full flex items-center px-4 py-2 hover:bg-indigo-100">
                    <i class="fas fa-check-to-slot mr-2"></i>
                    <span>Terminer</span>
                  </button>
                </li>
                <li>
                  <button @click.stop="handleLaunchEditTask" class="w-full flex items-center px-4 py-2 hover:bg-indigo-100">
                    <i class="fas fa-edit mr-2"></i>
                    <span>Modifier</span>
                  </button>
                </li>
                <li>
                  <button @click.stop="handleRemoveTask" class="w-full flex items-center px-4 py-2 hover:bg-indigo-100">
                    <i class="fas fa-trash mr-2"></i>
                    <span>Supprimer</span>
                  </button>
                </li>
                <li>
                  <div v-if = "!props.item.isShared">
                    <button @click.stop="handleShareTask" class="w-full flex items-center px-4 py-2 hover:bg-indigo-100">
                    <i class="fas fa-share-nodes mr-2"></i>
                    <span>Partager</span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          </div>

        </div>
        <div v-if="!iskTaskMine(props.item)">
          <div v-if="getSharedByUserName(props.item)">
          <p class="text-xs font-medium text-indigo-500"> <i> Par : {{props.item.user.username}}</i></p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed  } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { toggleTask, removeTask, toggleSharedTask } from '@/services/taskServices';
import { manageErrorCodeTaskAndSubtask } from '@/utils/manageUtils';
import { useTaskStore } from '@/stores/taskStore';
import { useRoute } from 'vue-router';


const props = defineProps(['item']); 
const emit = defineEmits(['clickOnTask', 'remove', 'edit']);
const authStore = useAuthStore();
const task = ref(props.item); 
const errorCode = ref('');
const errorMessage = ref('');
const taskStore = useTaskStore();
const route = useRoute();

const isCommunityRoute = computed(() => route.path === '/comunity');


const handleTaskClick = () => {
  taskStore.setSelectedTask(task.value);
  emit('clickOnTask', task.value); 
};

const handleToggleTask = async () => {
  const token = authStore.getToken; 

  if (!token) {
    console.error('Token non trouvé');
    console.log('Veuillez vous connecter pour continuer.'); 
    return; 
  }

  try {
    const responseToggleTask = await toggleTask(task.value.id, token); 

    if (responseToggleTask) {
      console.log('responseToggleTask', responseToggleTask)
      task.value.completed = responseToggleTask.task.completed;
      taskStore.updateSubtaskList(responseToggleTask.task, responseToggleTask.subTasks);
    }
  } catch (error) {
    const errorResponse = manageErrorCodeTaskAndSubtask(error.code, error.message);
    errorCode.value = errorResponse.code; 
    errorMessage.value = errorResponse.message; 
    console.error('handleToggleTask.error >> ', error);
    
    if (errorCode.value) {
      console.log(errorMessage.value); 
    }
  }
};

const handleLaunchEditTask = async () => {
  emit('edit', task.value.id);
};

const handleRemoveTask = async () => {
  const token = authStore.getToken; 

  if (!token) {
    console.error('Token non trouvé');
    console.log('Veuillez vous connecter pour continuer.'); 
    return; 
  }

  try {
    await removeTask(task.value.id, token);
    taskStore.deleteTask(task.value.id);
  } catch (error) {
    const errorResponse = manageErrorCodeTaskAndSubtask(error.code, error.message);
    errorCode.value = errorResponse.code; 
    errorMessage.value = errorResponse.message; 
    console.error('handleRemoveTask.error >> ', error);
    
    if (errorCode.value) {
      console.log(errorMessage.value); 
    }
  }
};
const handleShareTask = async () => {
  const token = authStore.getToken; 

  if (!token) {
    console.error('Token non trouvé');
    console.log('Veuillez vous connecter pour continuer.'); 
    return; 
  }

  try {
   const  response = await toggleSharedTask(task.value.id, token);
   task.value.isShared = response.isShared 
    taskStore.shareTask(task.value.id);
  } catch (error) {
    const errorResponse = manageErrorCodeTaskAndSubtask(error.code, error.message);
    errorCode.value = errorResponse.code; 
    errorMessage.value = errorResponse.message; 
    console.error('handleShareTask.error >> ', error);
    
    if (errorCode.value) {
      console.log(errorMessage.value); 
    }
  }
};
const iskTaskMine = (t) => {
  return t.userId === authStore.UID;
};

const getSharedByUserName = (id) => {
  const user = taskStore.sharedTaskList.find((u) => u.id === id);
  return user ? user.name : 'Utilisateur inconnu';
};


</script>

<style scoped>
.task-image {
  width: 80px; 
  height: auto; 
  border-radius: 0.5rem;
}
.line-through {
  text-decoration: line-through; 
}
</style>