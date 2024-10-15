<template>
    <div
      v-if="visible"
      class="fixed bottom-5 right-5 bg-white border border-gray-300 p-4 rounded shadow-lg max-w-xs"
    >
      <div class="flex items-start">
        <slot name="icon"></slot>
  
        <div class="ml-3">
          <slot name="content"></slot>
        </div>
        <button @click="close" class="ml-auto text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      close() {
        this.$emit("close");
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  