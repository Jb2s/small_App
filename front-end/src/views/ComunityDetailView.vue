<template>
    <div class="flex w-full h-screen bg-white">
      <!-- Chat Panel -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <div class="p-4 border-b flex items-center gap-3">
            <div>
              <h2 class="font-semibold">Tâche ID: {{ taskId }}</h2>
              <!-- <p
                class="text-sm"
                :class="{
                  'text-green-500': activeContactInfo.isOnline,
                  'text-gray-500': !activeContactInfo.isOnline,
                }"
              >
                {{ activeContactInfo.isOnline ? 'En ligne' : 'Hors ligne' }}
              </p> -->
            </div>
        </div>
  
        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4">
          <div
            v-for="comment in taskStore.allCommentsToTask"
            :key="comment.id"
            :class="['mb-2', isMineComment ? 'text-right' : 'text-left']"
          >
            <div
              :class="[
                'inline-block px-4 py-2 rounded-lg',
                isMineComment ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-800'

              ]"
            >
              <div v-if="isMineComment"> 
                <span> Moi</span>
              </div>
              <div v-if="!isMineComment">
                <span> {{ comment.user.username }}</span>
              </div>
              <p>{{ comment.content }}</p>
              <span class="text-xs text-gray-500"><small>{{ formatTimeStamp(comment.createdAt) }} </small></span>
            </div>
          </div>
        </div>
  
        <!-- Message Input -->
        <div class="p-4 border-t">
          <input
            v-model="newComment.content"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Envoyer un message..."
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>
      </div>
    </div>
  </template>
  
 <script setup>
import { ref, onMounted, watch, onBeforeUnmount, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { getCommentsToTask, addCommentToTask } from '@/services/taskServices';
import { format } from 'date-fns';


const route = useRoute();
const taskId = ref(route.params.id);
const authStore = useAuthStore();
const taskStore = useTaskStore();

const { proxy } = getCurrentInstance();
const socketStatus = ref('Déconnecté');

const newComment = ref({ 
   id: undefined,
   content: '',
   createdAt: undefined, 
   updatedAt: undefined, 
   user: { uid: authStore.UID , username: undefined},
 });
const token = authStore.getToken;

const formatTimeStamp = (time) =>{
  return format(new Date(time), " HH:mm ");
}

const loadCommentToTasks = async () => {
  console.log('loadCommentToTasks');
  if (token) {
    try {
      const result = await getCommentsToTask(taskId.value, token);
      console.log('result', result);
      taskStore.setCommentsToTask(result.task.comments);

      console.log('taskStore.allCommentsToTask', taskStore.allCommentsToTask);
    } catch (error) {
      console.error('loadTasks.error >> ', error);
    }
  }
};

const sendMessage = async () => {
  if (newComment.value.content.trim() !== '') {
    try {
      console.log('send messsage');
      const response = await addCommentToTask(newComment.value, taskId.value, token);
      console.log('response after add', response);
      proxy.$socket.emit('newComment', {
        id: response.comment.id,
        content: response.comment.content,
        taskId: taskId.value,
        createdAt: response.comment.createdAt,
        updatedAt: response.comment.updatedAt,
        user:{ id: response.comment.userId, username: authStore.username }

      });
      console.log("Données envoyées via Socket:", {
  id: response.id,
  content: response.content,
  taskId: taskId.value,
  createdAt: response.createdAt,
  updatedAt: response.updatedAt,
  user: {
    id: response.userId,
    username: authStore.username
  }
});

      newComment.value.content = '';
    } catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire:', error);
    }
  }
};

watch(
  () => route.params.id,
  (newId) => {
    console.log('New ID:', newId);
    taskId.value = newId;
  },
  { immediate: true }
);
const isMineComment = (t) => {
   return t.task.userId === authStore.UID;
};

onMounted(async () => {
  await loadCommentToTasks();

  proxy.$socket.connect();
  proxy.$socket.on('connect', () => {
    socketStatus.value = 'Connecté';
    console.log('Connexion établie avec le serveur WebSocket.');
  });

  proxy.$socket.on('newComment', (data) => {
    console.log('data', data);
    if (data.taskId === taskId.value) {
          if (Array.isArray(taskStore.allCommentsToTask)) {
      taskStore.allCommentsToTask.push(data);
    } else {
  console.error('allCommentsToTask is not an array');
}
    }
  });

  proxy.$socket.on('disconnect', () => {
    socketStatus.value = 'Déconnecté';
    console.log('Déconnexion du serveur WebSocket.');
  });
});

onBeforeUnmount(() => {
  proxy.$socket.disconnect();
  console.log('Socket déconnecté avant destruction du composant.');
});
</script>

  
  <style scoped>
  input[type='text'] {
    border: 1px solid #ddd;
  }
  </style>