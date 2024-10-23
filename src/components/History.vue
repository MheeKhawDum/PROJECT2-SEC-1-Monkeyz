<script setup>
import { ref, onMounted } from "vue";
import { getHistory, addOrder, getOrdersbyId } from "../lib/fetch.js";
import { useRouter } from "vue-router";
import HeaderFooterLayout from "./Header.vue";

const router = useRouter();
const historyItems = ref([]);

onMounted(async () => {
  await loadHistory();
});
function openMenu() {
  router.push({ name: "menuPage" });
}

const loadHistory = async () => {
  try {
    const data = await getHistory();

    // ปรับโครงสร้างข้อมูลเพื่อแสดงรายการเครื่องดื่ม
    const formattedHistory = data.map((order) => ({
      id: order.id,
      drinks: order.items, // เข้าถึงข้อมูลเครื่องดื่มใน items ได้โดยตรง
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
      ...drink, // ดึงข้อมูล drink ทั้งหมด
      sweetness: drink.sweetness, // ความหวาน
      drinkType: drink.drinkType, // ชนิดเครื่องดื่ม
      type: drink.type || "normal", // ประเภทเครื่องดื่ม ถ้าไม่มีกำหนดเป็น "normal"
    };

    // ส่งข้อมูลไปที่ตะกร้าโดยใช้ addOrder
    const response = await addOrder(orderDetails);
    console.log(response.message); // แสดงผลข้อความตอบกลับ

    router.push({ name: "cart" }); // นำทางไปที่หน้าตะกร้า
  } catch (error) {
    console.error("Error reordering item:", error);
  }
};
</script>

<template>
  <HeaderFooterLayout>
    <template #sidebar>
      <li><a href="#" @click="router.push({ name: 'menuPage' })">Menu</a></li>
      <li><a href="#" @click="router.push({ name: 'home' })">Home</a></li>
    </template>
    <div class="history-page h-screen">
      <h1 class="text-2xl font-bold text-slate-950">Your Order History</h1>
      <div v-if="historyItems.length === 0" class="empty-message">
        <p>No orders found in history.</p>
      </div>
      <div v-else class="history-list">
        <ul>
          <li v-for="order in historyItems" :key="order.id" class="order-card">
            <h2 class="font-bold text-slate-950">Order ID: {{ order.id }}</h2>
            <ul class="drink-list">
              <li
                v-for="drink in order.drinks"
                :key="drink.id"
                class="drink-item"
              >
                <img :src="drink.image" :alt="drink.name" class="drink-image" />
                <div class="drink-details font-semibold text-slate-950">
                  <h3>{{ drink.name }}</h3>
                  <p>Price: {{ drink.price }} THB</p>
                  <p>Sweetness: {{ drink.sweetness }}</p>
                  <p>Type: {{ drink.drinkType }}</p>
                </div>
                <button @click="reorder(drink)" class="reorder-btn">
                  Reorder
                </button>
                <button @click="openMenu" class="back-btn">Back</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </HeaderFooterLayout>
</template>

<style scoped>
.history-page {
  background-color: antiquewhite;
}

.empty-message {
  text-align: center;
  font-size: x-large;
  color: #ff0000;
}

.history-list {
  margin-top: 20px;
}

.order-card {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.drink-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.drink-item {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.drink-image {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 15px;
}

.drink-details {
  flex-grow: 1;
}

.reorder-btn {
  padding: 8px 15px;
  background-color: #38a169;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.back-btn {
  padding: 8px 15px;
  background-color: #fa5940;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reorder-btn:hover {
  background-color: #2f855a;
}
</style>
