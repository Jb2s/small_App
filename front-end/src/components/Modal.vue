<template>
  <div class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" v-if="selectedTask">
    <div class="task-details border-l-4 border-blue-500 p-4 w-11/12 max-w-sm md:max-w-md lg:max-w-lg">
      <div v-if="selectedTask">
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
  task: Object
});

const selectedTask = ref(props.task);

watch(() => props.task, (newTask) => {
  selectedTask.value = newTask;
});

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.highlight {
  @apply bg-gray-200 font-bold; 
}

.task-details {
  @apply bg-gray-100 border border-gray-300 rounded-lg shadow-md p-4;
}
</style>