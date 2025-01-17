<template>
  <div class="task-card flex bg-white border border-gray-300 rounded-lg shadow-md p-5 transition-shadow duration-200 hover:shadow-lg">
    <div class="task-content flex flex-col flex-grow">
      <span class="inline-block w-full px-2 py-1 text-md text-white mb-2" 
            :class="{ 'bg-green-500 rounded-sm': task.completed, 'bg-yellow-400 rounded-sm': !task.completed }">
        <i>{{ task.completed ? 'Complète' : 'Planifiée' }}</i>
      </span>
      <h5  class="task-title text-lg text-gray-900 cursor-pointer" :class="{ 'line-through': task.completed }" @click="handleTaskClick"><i>{{ task.title }}</i></h5>
      <h6 class="task-title text-md text-gray-700 cursor-pointer" @click="handleTaskClick"><i>{{ task.description }}</i></h6>
      <p class="task-subtasks-count text-sm text-gray-600">
        <i>{{ task.subtasks && task.subtasks.length > 0 ? task.subtasks.length + ' sous tâche(s)' : 'Aucune tâche' }}</i>
      </p>
      <div class="task-actions flex justify-end gap-2">
        <button @click.stop="handleToggleTask" class="btn bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center px-2 py-1 hover:bg-blue-600">
          <i class="fas fa-check"></i>
        </button>
        <button @click.stop="handleLaunchEditTask" class="red-button bg-yellow-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-yellow-600 transition">
          <i class="fas fa-edit"></i> 
        </button> 
        <button @click.stop="handleRemoveTask" class="red-button bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition">
          <i class="fas fa-times"></i> 
        </button>          
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { toggleTask, removeTask } from '@/services/taskServices';
import { manageErrorCodeTaskAndSubtask } from '@/utils/manageUtils';
import { useTaskStore } from '@/stores/taskStore';

const props = defineProps(['item']); 
const emit = defineEmits(['clickOnTask', 'remove', 'edit']);
const authStore = useAuthStore();
const task = ref(props.item); 
const errorCode = ref('');
const errorMessage = ref('');
const taskStore = useTaskStore();

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
    emit('remove', task.value.id); 
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
