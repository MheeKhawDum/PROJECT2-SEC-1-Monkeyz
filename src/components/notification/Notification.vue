<template>
  <div v-if="visible" class="notification">
    <div class="notification-content">
      <slot name="icon"></slot>
      <slot name="content"></slot>
      <button @click="$emit('close')">&ensp; Close</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
.notification-content {
  display: flex;
  align-items: center;
}
</style>
