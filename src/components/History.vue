<script setup>
import { ref, onMounted } from 'vue';
import { getHistory, addOrder, getOrdersbyId } from '../lib/fetch.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const historyItems = ref([]);

onMounted(async () => {
  await loadHistory();
});

const loadHistory = async () => {
  try {
    const data = await getHistory();

    // ปรับโครงสร้างข้อมูลเพื่อแสดงรายการเครื่องดื่ม
    const formattedHistory = data.map(order => ({
      id: order.id,
      drinks: order.items // เข้าถึงข้อมูลเครื่องดื่มใน items ได้โดยตรง
    }));

    historyItems.value = formattedHistory;
  } catch (error) {
    console.error("Error loading history:", error);
  }
};

const reorder = async (drink) => {
  try {
    // สร้าง orderDetails จากข้อมูล drink ที่ส่งมา
    const orderDetails = {
      ...drink,  // ดึงข้อมูล drink ทั้งหมด
      sweetness: drink.sweetness,  // ความหวาน
      drinkType: drink.drinkType,  // ชนิดเครื่องดื่ม
      type: drink.type || "normal",  // ประเภทเครื่องดื่ม ถ้าไม่มีกำหนดเป็น "normal"
    };

    // ส่งข้อมูลไปที่ตะกร้าโดยใช้ addOrder
    const response = await addOrder(orderDetails);
    console.log(response.message); // แสดงผลข้อความตอบกลับ

    router.push({ name: 'cart' }); // นำทางไปที่หน้าตะกร้า
  } catch (error) {
    console.error("Error reordering item:", error);
  }
};

</script>

<template>
  <div>
    <h1>Your Order History</h1>
    <div v-if="historyItems.length === 0">
      <p>No orders found in history.</p>
    </div>
    <div v-else>
      <ul>
        <!-- Loop ผ่าน history -->
        <li v-for="order in historyItems" :key="order.id">
          <h2>Order ID: {{ order.id }}</h2>
          <ul>
            <!-- Loop ผ่านเครื่องดื่มในแต่ละ order -->
            <li v-for="drink in order.drinks" :key="drink.id">
              <img :src="drink.image" :alt="drink.name" width="50" height="50">
              <div>
                <h3>{{ drink.name }}</h3>
                <p>Price: {{ drink.price }} THB</p>
                <p>Sweetness: {{ drink.sweetness }}</p>
                <p>Type: {{ drink.drinkType }}</p>
              </div>
              <button @click="reorder(drink)" class="border border-green-500 rounded-2xl p-2">Reorder {{ drink }}</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
