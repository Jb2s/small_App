<template>
  <div class="modal-overlay" v-if="selectedTask || taskDeleted">
    <div class="task-details border-l-4 border-blue-500 p-4 w-1/3">
      <div v-if="taskDeleted">
        <p>La tâche "{{ deletedTaskName }}" a été supprimée.</p>
      </div>
      <div v-else-if="selectedTask">
        <h1 class="text-2xl mb-2 text-gray-800">
          Description de <span class="highlight">{{ selectedTask.title }}</span>
        </h1>
        <p>{{ selectedTask.description }}</p>
        <p><strong>Sous-tâches :</strong></p>
        <div v-if="selectedTask.todoTask && selectedTask.todoTask.length > 0">
          <ul class="list-disc pl-5">
            <li v-for="(detail, index) in selectedTask.todoTask" :key="detail.id">{{ detail.titre }}</li>
          </ul>
        </div>
        <div v-else>
          <p>Aucune sous-tâche trouvée</p>
        </div>
      </div>
      <button @click="$emit('close')" class="bg-red-500 text-white px-4 py-2 rounded mt-4">Fermer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';

const props = defineProps({
  task: Object // Recevoir la tâche comme prop
});

const selectedTask = ref(props.task);
const taskDeleted = ref(false);
const deletedTaskName = ref('');

// Écouter les modifications de la prop task
watch(() => props.task, (newTask) => {
  selectedTask.value = newTask;
});

// Fonction pour fermer la modal
const closeModal = () => {
  selectedTask.value = null;
  taskDeleted.value = false;
};

// Fonction pour gérer la tâche supprimée
const handleTaskDeletion = (taskName) => {
  deletedTaskName.value = taskName;
  taskDeleted.value = true;
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