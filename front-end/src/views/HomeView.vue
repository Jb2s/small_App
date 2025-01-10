
<template>
  <div class="p-5">
    <div class="add-task-form bg-gray-100 border border-gray-300 rounded-lg p-5 mb-5 shadow-sm max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      <input 
        v-model="newTask.title" 
        placeholder="Ajouter une nouvelle tâche" 
        class="border border-gray-300 p-2 rounded w-full" 
      />
      <textarea 
        v-model="newTask.description" 
        placeholder="Description de la tâche" 
        class="border border-gray-300 p-2 rounded w-full mt-2" 
      ></textarea>
      <div class="mt-2">
        <div v-for="(subTask, index) in newTask.subTasks" :key="index" class="mb-2">
          <input 
            v-model="subTask.title" 
            placeholder="Sous-tâche" 
            class="border border-gray-300 p-2 rounded w-full" 
          />
        </div>
        <button 
          @click="handleAddDetailTask" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Ajouter sous-tâche
        </button>
      </div>
      <button 
        @click="handleAddNewTask" 
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-5 w-full"
      >
        Ajouter Tâche
      </button>
    </div>

    <div class="task-list bg-gray-100 border border-gray-300 rounded-lg p-5 shadow-sm max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      <h1 class="text-lg font-bold mb-4 text-gray-800">Liste des Tâches</h1>
          <TodoTask 
            :item="task" 
            @clickOnTask="openModal(task)" 
          />
      <div class="no-tasks text-center">
        <img class="task-image max-w-full h-auto" src="@/assets/koala.png" alt="Image" />
        <p>Aucune tâche disponible.</p>
      </div>
    </div>
    <Modal 
      v-if="isModalOpen" 
      :task="selectedTask" 
      @close="closeModal" 
    />
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { addTask, addSubTasks } from '@/services/taskServices';
import { manageErrorCodeTaskAndSubtask } from '@/Utils/manageUtils';

const authStore = useAuthStore();
const newTask = ref({ title: '', description: '', subTasks: [{ title: '' }] });
const errorMessage = ref('');
const isModalOpen = ref(false);
const selectedTask = ref(null);

const openModal = (task) => {
    selectedTask.value = task;
    isModalOpen.value = true; 
};

const closeModal = () => {
    isModalOpen.value = false; 
    selectedTask.value = null; 
};

const handleAddDetailTask = () => {
    if (newTask.value.subTasks.at(-1).title.trim()) {
        newTask.value.subTasks.push({ title: '' });
    }
};

const handleAddNewTask = async () => {
    if (!newTask.value.title.trim()) return;

    const token = authStore.getToken;
    if (!token) return console.error('Token non trouvé');

    try {
        const responseTask = await addTask(newTask.value.title, newTask.value.description, token);
        console.log('Tâche ajoutée :', responseTask);

        if (newTask.value.subTasks.length > 0) {
            await addSubTasks(responseTask.id, newTask.value.subTasks.map(subTask => subTask.title), token);
        }

        resetNewTask();
    } catch (error) {
        handleError(error);
    }
};

const resetNewTask = () => {
    newTask.value.title = '';
    newTask.value.description = '';
    newTask.value.subTasks = [{ title: '' }];
};

const handleError = (error) => {
    const { code, message } = manageErrorCodeTaskAndSubtask(error.code, error.message);
    errorMessage.value = message;
    
    if (code) alert(message);
    
    console.error('Erreur survenue :', error);
};
</script>

<style scoped>
.task-image {
  width: 80px; 
  height: auto; 
  border-radius: 0.5rem;
  margin-right: 15px; 
}
</style>
