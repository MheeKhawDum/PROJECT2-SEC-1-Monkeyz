<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router"
import HeaderFooterLayout from './Header.vue';
import { getList } from "@/lib/fetch";

const router = useRouter()
const listCoffee = ref(null)
const listTea = ref(null)
const listMilk = ref(null)

async function fetchData() {
  const resCoffee = await getList("coffeeMenu")
  const resTea = await getList("teaMenu")
  const resMilk = await getList("milkMenu")
  // console.log(res);
  
  listCoffee.value = resCoffee.data
  listTea.value = resTea.data
  listMilk.value = resMilk.data
}
fetchData()
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
      <h1>Coffee</h1>
      <div v-for="(item, index) in listCoffee" :key="index" class="menu-item">
          <p>{{ item.name }} - {{ item.price }} THB</p>
        </div>
    </div>
    <div>
      <h1>Tea</h1>
      <div v-for="(item, index) in listTea" :key="index" class="menu-item">
          <p>{{ item.name }} - {{ item.price }} THB</p>
        </div>
    </div>
    <div>
      <h1>Milk</h1>
      <div v-for="(item, index) in listMilk" :key="index" class="menu-item">
          <p>{{ item.name }} - {{ item.price }} THB</p>
        </div>
    </div>
  </HeaderFooterLayout>
</template>
  
 
<style scoped>

</style>