<template>
    <div>
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          @click="handleChoice('me')"
          :class="['px-4 py-2 text-sm font-medium border border-gray-300 rounded-bl-none rounded-s-lg ', selectedChoice === 'me'? 'bg-gray-100 text-gray rounded-b-none border-b-0': 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray',
          ]"
        >
          Moi
        </button>
        <button
          type="button"
          @click="handleChoice('others')"
          :class="['px-4 py-2 text-sm font-medium border rounded-br-none border-gray-300 rounded-e-lg  ', selectedChoice === 'others'? 'bg-gray-100 text-gray border-b-0 rounded-b-none': 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray',
          ]"
        >
          Autres
        </button>
      </div>
      <div :class="['border border-gray-300 bg-gray-100 rounded-b-lg p-5 ']">
          <div v-if="selectedChoice === 'me'">
            <div class=" justify-center">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="(task) in taskStore.taskList" :key="task.id" class="mb-4">
                  <div v-if="isTaskMineShared(task)">
                    <TodoTask 
                    :item="task" 
                    @clickOnTask="openModal(task)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedChoice === 'others'">
            <div class=" justify-center">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="(task) in taskStore.sharedTaskList" :key="task.id" class="mb-4">
                  <div v-if="!isTaskMineShared(task)">
                    <TodoTask 
                    :item="task" 
                    @clickOnTask="openModal(task)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal 
          v-if="isModalOpen" 
          :task="taskStore.selectedTask" 
          @close="closeModal" 
          />
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import TodoTask from '@/components/Task.vue'; 
  import Modal from '@/components/Modal.vue'; 
  import { useTaskStore } from '@/stores/taskStore';
  import { useAuthStore } from '@/stores/authStore';
  import { getSharedTasks } from '@/services/taskServices';


  const authStore = useAuthStore();
  const selectedChoice = ref("me");
  const isModalOpen = ref(false);
  const taskStore = useTaskStore();

  const closeModal = () => {
  isModalOpen.value = false; 
};
const openModal = (task) => {
  console.log('task', task)
  const st = { ...Array.from(taskStore.taskList).find(t => t.id === task.id)}
  console.log('st', st)
  taskStore.selectedTask = task;
  isModalOpen.value = true; 
};
  const handleChoice = (choice) => {
    selectedChoice.value = choice;
    console.log(selectedChoice.value);
    console.log(taskStore.sharedTaskList);
    loadSharedTasks();

  };
  const isTaskMineShared = (t) => {
  return t.userId === authStore.UID;
};

  const loadSharedTasks = async () => {
   const token = authStore.getToken;
   if (token) {
       try {
          const result = await getSharedTasks(token);
          console.log('result shared', result);
          taskStore.setSharedTaskList(result);
       } catch (error) {
           console.error('loadSharedTasks.error >> ', error);
       }
   }
}

  </script>
  
  <style scoped>
  button {
    margin-bottom: -2px;
  }
  </style>