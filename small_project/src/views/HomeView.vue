<template>
  <div class="p-5">
    <div class="add-task-form bg-gray-100 border border-gray-300 rounded-lg p-5 mb-5 shadow-sm max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      <input 
        v-model="newTask.text" 
        placeholder="Ajouter une nouvelle tâche" 
        class="border border-gray-300 p-2 rounded w-full" 
      />
      <div class="mt-2">
        <div v-for="(detail, index) in newTask.todoList" :key="index" class="mb-2">
          <input 
            v-model="newTask.todoList[index]" 
            placeholder="todo(s)" 
            class="border border-gray-300 p-2 rounded w-full" 
          />
        </div>
        <button 
          @click="addDetailTask" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Ajouter todo
        </button>
        <input 
          type="file" 
          @change="onFileChange" 
          accept="image/*" 
          class="mt-2 p-2 w-full" 
        />
        <br>
      </div>
      <button 
        @click="addNewTask" 
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-5 w-full"
      >
        Ajouter Tâche
      </button>
    </div>

    <div class="task-list bg-gray-100 border border-gray-300 rounded-lg p-5 shadow-sm max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      <h1 class="text-lg font-bold mb-4 text-gray-800">Liste des Tâches</h1>
      <div v-if="todos.length">
        <div v-for="(task, index) in todos" :key="task.id" class="mb-4">
          <TodoTask 
            :item="task.id" 
            @clickOnTask="openModal(task)" 
          />
        </div>
      </div>
      <div v-else class="no-tasks text-center">
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
import { ref, onMounted, computed } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import TodoTask from '@/components/TodoTask.vue';
import Modal from '@/components/Modal.vue';

const todoStore = useTodoStore(); 
const newTask = ref({ text: '', todoList: [''] });
const isModalOpen = ref(false);
const selectedTask = ref(null);

const todos = computed(() => todoStore.todos);

const openModal = (task) => {
  selectedTask.value = task;
  isModalOpen.value = true; 
};

const closeModal = () => {
  isModalOpen.value = false; 
  selectedTask.value = null; 
};

const addDetailTask = () => {
  if (newTask.value.todoList[newTask.value.todoList.length - 1].trim() === '') return;
  newTask.value.todoList.push('');
};

const addNewTask = () => {
  if (newTask.value.text.trim() === '') return;
  if (newTask.value.todoList.length > 0) {
    newTask.value.todoList.pop(); 
  }

  const newTodoId = todoStore.addTodo(newTask.value.text, ''); 

  newTask.value.todoList.forEach((item) => {
    if (item.trim()) {
      todoStore.addTodoTask(newTodoId, item);
    }
  });

  newTask.value.text = '';
  newTask.value.todoList = [''];
};

onMounted(() => {
  todoStore.loadTodos();
});
</script>

<style scoped>
.task-image {
  width: 80px; 
  height: auto; 
  border-radius: 0.5rem;
  margin-right: 15px; 
}
</style>