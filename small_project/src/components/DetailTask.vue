<template>
  <div class="modal-overlay" v-if="taskStore.selectedTask || taskStore.taskDeleted">
    <div class="task-details border-l-4 border-blue-500 p-4 w-1/3">
      <div v-if="taskStore.taskDeleted">
        <p>La tâche "{{ taskStore.deletedTaskName }}" a été supprimée.</p>
      </div>
      <div v-else-if="taskStore.selectedTask">
        <h1 class="text-2xl mb-2 text-gray-800">
          Description de <span class="highlight">{{ taskStore.selectedTask.text }}</span>
        </h1>
        <p><strong>todo(s):</strong></p>
        <div v-if="taskStore.selectedTask.todoList.length > 0">
          <ul class="list-disc pl-5">
            <li v-for="(detail, index) in taskStore.selectedTask.todoList" :key="index">{{ detail }}</li>
          </ul>
        </div>
        <div v-else>
          <p>Aucune todo trouvée</p>
        </div>
      </div>
      <button @click="closeModal" class="bg-red-500 text-white px-4 py-2 rounded mt-4">Fermer</button>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '@/stores/taskStore'; // Assurez-vous d'importer votre store

const taskStore = useTaskStore();

const closeModal = () => {
  taskStore.selectedTask = null; // Réinitialiser la tâche sélectionnée
  taskStore.taskDeleted = false;  // Réinitialiser l'état de suppression si nécessaire
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Couleur de fond semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Assurez-vous que le modal est au-dessus des autres contenus */
}

.highlight {
  @apply bg-gray-200 font-bold; 
}

.task-details {
  @apply bg-gray-100 border border-gray-300 rounded-lg shadow-md p-4;
}
</style>