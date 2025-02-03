<template>
    <div class="p-5">

      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          @click="handleChoice('me')"
          :class="['px-4 py-2 text-sm font-medium border border-gray-300 rounded-bl-none rounded-s-lg ', selectedChoice === 'me'? 'bg-gray-100 text-gray rounded-b-none border-b-0': 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray',]">
          Moi
        </button>
        <button
          type="button"
          @click="handleChoice('others')"
          :class="['px-4 py-2 text-sm font-medium border rounded-br-none border-gray-300 rounded-e-lg  ', selectedChoice === 'others'? 'bg-gray-100 text-gray border-b-0 rounded-b-none': 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray',]">
          Autres
        </button>
      </div>

      <div :class="['border border-gray-300 bg-gray-100 rounded-b-lg p-5 ']" >
        <div v-show="selectedChoice === 'me'">
          <div class=" justify-center">
            <div>
              <div v-if="!hasSharedTasks">
                <p class="text-gray-500 text-md text">Vous n'avez partagé aucune tâche(s) jusqu'ici.</p>
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" >
                <div v-for="(task) in taskStore.taskList" :key="task.id" class="mb-4">
                  <div>
                    <div v-if="task.isShared">
                      <TodoTask 
                        :item="task" 
                        @clickOnTask="openModal(task)"
                        />
                        <div class="flex justify-end mt-2 text-xs text-indigo-400" >
                          <router-link
                          :to="`/comunity/${task.id}`"
                          class="text-indigo-400 hover:bg-indigo-500 hover:text-indigo-100 px-4 py-2 rounded-full"
                          >
                          <i> Discuter <i class="fas fa-comments mr-2"></i></i> 
                          </router-link>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="selectedChoice === 'others'">
          <div v-if="!taskStore.sharedTaskList.length">
            <p class="text-gray-500 text-md text"> Aucune tâche(s) partagée(s) jusqu'ici. </p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(task) in taskStore.sharedTaskList" :key="task.id" class="mb-4" >
              <div>
                <TodoTask 
                :item="task" 
                @clickOnTask="openModal(task)"
                />
                <div class="flex justify-end mt-2 text-xs text-indigo-400">
                  <router-link
                    :to="`/comunity/${task.id}`"
                    class="text-indigo-400 hover:bg-indigo-500 hover:text-indigo-100 px-4 py-2 rounded-full"
                  >
                  <i> Discuter <i class="fas fa-comments mr-2"></i></i> 
                  </router-link>                  
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
  import { ref, computed, onMounted } from "vue";
  import TodoTask from '@/components/Task.vue'; 
  import Modal from '@/components/Modal.vue'; 
  import { useTaskStore } from '@/stores/taskStore';
  import { useAuthStore } from '@/stores/authStore';
  import { getSharedTasksOthers,getUserTasks } from '@/services/taskServices';


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

const hasSharedTasks = computed(() => taskStore.taskList.some(t => t.isShared));

  const loadSharedTasks = async () => {
   const token = authStore.getToken;
   if (token) {
       try {
          const result = await getSharedTasksOthers(token);
          console.log('result shared', result);
          taskStore.setSharedTaskList(result.sharedTasks);
       } catch (error) {
           console.error('loadSharedTasks.error >> ', error);
       }
   }
}

const loadTasks = async () => {
  console.log('loadTasks');
   const token = authStore.getToken;
   if (token) {
       try {
          const result = await getUserTasks(token);
          taskStore.setTaskList(result);
          console.log('result in front end', result)
          console.log('TASK STORE',  taskStore.taskList)
       } catch (error) {
           console.error('loadTasks.error >> ', error);
       }
   }
}

onMounted( async () => {
await loadTasks();
});
  </script>
  
  <style scoped>
  button {
    margin-bottom: -2px;
  }
  .router-link {
  background-color: rgb(67 56 202); 
  color: white;
}
  </style>

  