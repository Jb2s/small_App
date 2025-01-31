<script setup>
import { computed, defineProps } from "vue";


const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: [String, Number],
    required: true
  }
});

const isMineComment = computed(() => String(props.comment.user.id) === String(props.currentUserId));

const formatTimeStamp = (timestamp) => new Date(timestamp).toLocaleString('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  second: undefined,
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});
</script>

<template>
  <div :class="['mb-4 flex', isMineComment ? 'justify-end' : 'justify-start']">
    <div
      :class="[
        'max-w-xs px-4 py-2 rounded-3xl',
        isMineComment ? 'bg-indigo-100 text-indigo-600 rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
      ]"
    >
      <div>
        <span v-if="isMineComment" class="text-xs text-indigo-600 ">Moi</span>
        <span v-else class="text-xs text-gray-600">{{ comment.user.username }}</span>
      </div>
      <p>{{ comment.content }}</p>
      <span class="block text-xs mt-1" :class="[ isMineComment ? 'text-indigo-400':'text-gray-400']">
        <small>{{ formatTimeStamp(comment.createdAt) }}</small>
      </span>
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}
</style>
