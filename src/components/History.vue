<template>
  <div>
    <h1>Your Order History</h1>
    <div v-if="historyItems.length === 0">
      <p>No orders found in history.</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="item in historyItems" :key="item.id">
          <div>
            <h2>{{ item.name }}</h2>
            <p>Price: {{ item.price }} THB</p>
            <p>Sweetness: {{ item.sweetness }}</p>
            <button @click="reorder(item.id)">Reorder</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getHistory, addOrder } from '../lib/fetch.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const historyItems = ref([]);

onMounted(async () => {
  await loadHistory();
});

const loadHistory = async () => {
  try {
    const data = await getHistory();
    historyItems.value = data;
  } catch (error) {
    console.error("Error loading history:", error);
  }
};

const reorder = async (historyId) => {
  try {
    const historyItem = await getOrdersbyId(historyId); // ดึงข้อมูลจาก history
    await addOrder(historyItem); // เพิ่มข้อมูลเข้าไปใน cart
    router.push({ name: 'cartPopup' }); // นำทางไปที่ CartPopup.vue
  } catch (error) {
    console.error("Error reordering item:", error);
  }
};
</script>
