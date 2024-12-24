<template>
  <div class="task-card flex bg-white border border-gray-300 rounded-lg shadow-md p-5 transition-shadow duration-200 hover:shadow-lg">
    <img v-if="task.image" class="task-image w-20 h-20 rounded-md mr-4" :src="task.image" alt="Image de tâche" />
    <div class="task-content flex flex-col flex-grow">
      <span class="task-status inline-block px-2 py-1 rounded text-white mb-2" :class="{ 'bg-green-500': task.status, 'bg-yellow-400': !task.status }">
        {{ task.status ? 'Complète' : 'Planifiée' }}
      </span>
      <h3 class="task-title text-lg text-gray-900 cursor-pointer" @click="handleTaskClick">{{ task.title }}</h3>
      <p v-if="task.todoTask.length > 0" class="task-subtasks-count text-gray-600">{{ task.todoTask.length }} todo</p>
      <p v-else class="task-subtasks-count text-gray-600">Aucune todo</p>
      <div class="task-actions flex justify-end gap-2">
        <button @click.stop="toggleTask(task.id)" class="btn bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600">
          <i class="fas fa-check"></i>
        </button>
        <button @click.stop="removeTask(task.id)" class="red-button bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useTodoStore } from '@/stores/todoStore';

const props = defineProps(['item']); 
const emit = defineEmits();

const todoStore = useTodoStore(); // Utiliser le store
const task = todoStore.todos.find(todo => todo.id === props.item); // Trouver la tâche par ID

const handleTaskClick = () => {
  emit('click', task); // Émettre l'événement avec la tâche
};

const toggleTask = (id) => {
  todoStore.toggleTodo(id); // Méthode pour basculer l'état de la tâche
};

const removeTask = (id) => {
  todoStore.deleteTodo(id); // Méthode pour supprimer la tâche
};
</script>

<style scoped>
.task-image {
  width: 80px; 
  height: auto; 
  border-radius: 0.5rem;
}
</style>