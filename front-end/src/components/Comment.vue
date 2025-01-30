<template>
  <div class="coment">
    <p><strong>{{ props.appartenance }}</strong> : {{ props.contenu }}</p>
  </div>
</template>

<script setup>

const props = defineProps({
    contenu: {
      type: String,
      required: true,
      default: " I send Message",

    },
    appartenance: {
      type: String,
      required: true,
      default: "Moi",
    },

}); 

</script>

<style scoped>
.coment {
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 200px;
}
</style>