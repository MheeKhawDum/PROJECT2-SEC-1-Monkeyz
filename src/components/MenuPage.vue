<script setup>
import HeaderFooterLayout from './Header.vue';
</script>
 
<template>
    <HeaderFooterLayout>
      <!-- Slot for sidebar -->
      <template #sidebar>
        <li><a href="#">Menu Item 1</a></li>
        <li><a href="#">Menu Item 2</a></li>
      </template>
  
      <!-- Slot for title -->
      <template #title>
        <a class="btn btn-ghost text-xl text-white justify-start">My Custom Title</a>
      </template>
  
      <!-- Slot for cart -->
      <template #cart>
        <button class="btn btn-square btn-ghost bg-white rounded-xl">My Custom Cart</button>
      </template>
  
      <!-- Main content -->
      <div>
        <p>Main content goes here.</p>
      </div>
  
      <!-- Slot for footer -->
      <template #footer>
        <p>My Custom Footer © 2024</p>
      </template>
    </HeaderFooterLayout>
  </template>
  
 
<style scoped>

</style>