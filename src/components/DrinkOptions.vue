<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // ใช้เพื่อดึง params จาก router
import { getItems } from '../lib/fetch'; // ฟังก์ชันสำหรับดึงข้อมูล

const route = useRoute(); // เข้าถึงข้อมูลที่ถูกส่งมาใน params
const router = useRouter();
const selectedMenuItem = ref(null); // ตัวแปรเก็บข้อมูลเครื่องดื่มที่เลือก
const menuItems = ref([]); // ตัวแปรสำหรับเก็บรายการเครื่องดื่มทั้งหมด

// ฟังก์ชันเพื่อดึงข้อมูลเมนู
async function fetchMenu() {
  const coffeeMenu = await getItems(`${import.meta.env.VITE_BASE_URL}/coffeeMenu`);
  const teaMenu = await getItems(`${import.meta.env.VITE_BASE_URL}/teaMenu`);
  const milkMenu = await getItems(`${import.meta.env.VITE_BASE_URL}/milkMenu`);

  menuItems.value = [...coffeeMenu, ...teaMenu, ...milkMenu]; // รวมเมนูทั้งหมด

  console.log(menuItems.value); // ตรวจสอบข้อมูลที่ถูกดึงมา

  // ค้นหารายการเครื่องดื่มที่ตรงกับชื่อที่ส่งมา
  const drinkName = route.params.name;
  console.log(drinkName)
  selectedMenuItem.value = menuItems.value.find(item => item.name === drinkName);

  console.log(selectedMenuItem.value); // ตรวจสอบค่า selectedMenuItem หลังจากหาเจอ
}


// เรียกฟังก์ชันดึงข้อมูลเมื่อ component ถูกโหลด
fetchMenu();
console.log(selectedMenuItem)
function openMenu(){
    router.push({name: 'menuPage'})
}
function openCart(){
    router.push({name: 'cart'})
}
</script>

<template>
    <div v-if="selectedMenuItem" class="drink-option">
      <h1>{{ selectedMenuItem.name }}</h1>
      <img :src="selectedMenuItem.image" :alt="selectedMenuItem.name" />
      <p>Price: {{ selectedMenuItem.price }} THB</p>
      <button @click="openMenu">Back</button>
      <button @click="openCart">Submit</button>
    </div>
    <div v-else>
      <p>Drink not found.</p>
      <button>Back</button>
    </div>
  </template>
  

<style scoped>

</style>