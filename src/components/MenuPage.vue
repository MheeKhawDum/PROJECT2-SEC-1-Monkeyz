<script setup>
import { useRoute, useRouter } from "vue-router"
import HeaderFooterLayout from './Header.vue';

const router = useRouter()
</script>
 
<template>
    <HeaderFooterLayout>
      <!-- Slot for sidebar -->
      <template #sidebar>
        <li><a href="#" @click="router.push({name: 'menuPage'})">Menu</a></li>
        <li><a href="#" @click="router.push({name: 'home'})">Home</a></li>
      </template>
      <!-- Main content -->
      <div>
        <p>ใส่คอนเท้นท์ตรงนี้นะจ๊ะ</p>
      </div>
    </HeaderFooterLayout>
  </template>
  
 
<style scoped>

</style>