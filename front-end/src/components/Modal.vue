<template>
  <div class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" v-if="taskStore.selectedTask">
    <div class="task-details bg-white rounded-lg shadow-lg w-11/12 max-w-sm md:max-w-md lg:max-w-lg">
      <div class="modal-header border-b border-gray-300 p-4">
        <h1 class="text-2xl text-gray-800">
          <i>{{ taskStore.selectedTask.title }}</i>
        </h1>
      </div>
      <div class="modal-body overflow-auto p-4">
        <p class="mb-2 "><i>{{ taskStore.selectedTask.description }}</i></p>

        <div v-if="taskStore.selectedTask.subtasks && taskStore.selectedTask.subtasks.length > 0">
          <ul class="list-disc pl-5">
            <li v-for="(subtask) in taskStore.selectedTask.subtasks" :key="subtask.id" class="flex justify-between mb-2">
              <span :class="{ 'line-through': subtask.completed }"><i>{{ subtask.title }}</i></span>
              <div class="flex items-center space-x-2"> <!-- Conteneur pour les boutons -->
                <button @click="handletoggleSubTask(subtask)" type="button" class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white font-small rounded-full text-xs p-1 text-center inline-flex items-center">
                  <svg v-if="subtask.completed" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-width="2" d="M2.5,9l5,5L15,4"/>
                  </svg>
                </button>
                <button @click.stop="handleRemovesubTask(subtask)" class="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Aucune sous tâche trouvée</p>
        </div>
      </div>

      <div class="modal-footer flex justify-end p-4 border-t border-gray-300">
        <button @click="$emit('close')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { toggleSubTask,removeSubTask } from '@/services/subtaskServices';
import { manageErrorCodeTaskAndSubtask } from '@/utils/manageUtils';
import { useTaskStore } from '@/stores/taskStore';

const props = defineProps({
  task: Object
});

console.log('props.task >> ', props.task);
const authStore = useAuthStore();
const taskStore = useTaskStore();
const emit = defineEmits(['toggle', 'remove', 'close']);
const selectedTask = ref(props.task);

watch(() => taskStore.selectedTask, (thisTask) => {
    selectedTask.value = thisTask;
});

const handletoggleSubTask = async (subtask) => {
  const token = authStore.getToken;
  console.log('token >> ', token);
  console.log('subtask >> ', subtask);
  if (!token) return console.error('Token non trouvé');
  try {
    const responseSubTask = await toggleSubTask(selectedTask.value.id, subtask.id, token);
    if (responseSubTask) {
      console.log('responseSubTask >> ', responseSubTask);
      subtask.completed = responseSubTask.subTask.completed;
      taskStore.updateTask(responseSubTask.task.id,responseSubTask.subTask)
      emit('toggle'); 
    }
    
  } catch (error) {
    const errorResponse = manageErrorCodeTaskAndSubtask(error.code, error.message);
    console.error('handleAddNewTask.error >> ', error);
    alert(errorResponse.message);
  }
};

const handleRemovesubTask = async (subtask) => {
  const token = authStore.getToken;
  console.log('token >> ', token);
  if (!token) return console.error('Token non trouvé');
  try {
    removeSubTaskFromList(selectedTask.value.id, subtask.id)
    const responseSubTask = await removeSubTask(selectedTask.value.id, subtask.id, token);
    if (responseSubTask) {
      console.log('responseSubTask',responseSubTask)
    }
    
  } catch (error) {
    const errorResponse = manageErrorCodeTaskAndSubtask(error.code, error.message);
    console.error('handleAddNewTask.error >> ', error);
    alert(errorResponse.message);
  }
};

const removeSubTaskFromList = (taskId, subtaskId) => {
  const task = taskStore.taskList.find(t => t.id === taskId); 
    if (task) {
      task.subtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId); 
    }
};

</script>

<style scoped>
.line-through {
    text-decoration: line-through; 
}
</style>
