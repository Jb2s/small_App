<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <div class="flex-1 flex flex-col">
      <div class="p-4 border-b flex items-center gap-3 bg-white sticky top-0 z-10">
        <h2 class="font-semibold text-base sm:text-lg md:text-xl">Tâche ID: {{ taskId }}</h2>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <Comment
          v-for="comment in taskStore.allCommentsToTask"
          :key="comment.id"
          :comment="comment"
          :currentUserId="authStore.UID"
        />
      </div>

      <div class="p-4 border-t bg-white sticky bottom-0 z-10">
        <input
          v-model="newComment.content"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Discuter sur cette tâche..."
          class="w-full p-2 sm:p-3 md:p-4 border rounded-xl text-sm sm:text-base md:text-lg focus:outline-none focus:ring focus:ring-indigo-300"
        />
      </div>
    </div>
  </div>
</template>
  
 <script setup>
import { ref, onMounted, watch, onBeforeUnmount, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import Comment from '@/components/Comment.vue'; 
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { getCommentsToTask, addCommentToTask } from '@/services/taskServices';


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


onMounted(async () => {
  await loadCommentToTasks();
console.log('authStore.UID', authStore.UID)
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