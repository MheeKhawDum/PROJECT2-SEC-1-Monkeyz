
<script setup>
import { ref, onMounted } from "vue";
import { getOrders, deleteOrder } from '../lib/fetch.js'; // นำเข้าฟังก์ชัน getOrders จาก fetch.js
import HeaderFooterLayout from './Header.vue'
import { useRouter } from "vue-router";

// สร้างตัวแปรสำหรับเก็บข้อมูลคำสั่งซื้อ
const orders = ref([]);
const router = useRouter()

// เมื่อ component ถูก mount ให้ดึงข้อมูลคำสั่งซื้อจากฐานข้อมูล
onMounted(async () => {
  await loadOrders();
});

// ฟังก์ชันสำหรับโหลดคำสั่งซื้อ
const loadOrders = async () => {
  try {
    const data = await getOrders(); // เรียกใช้ฟังก์ชัน getOrders เพื่อดึงข้อมูล
    orders.value = data; // เก็บข้อมูลที่ได้ลงใน orders
  } catch (error) {
    console.error("Error loading orders:", error);
  }
};

// ฟังก์ชันสำหรับลบคำสั่งซื้อ
const removeOrder = async (orderId) => {
  try {
    await deleteOrder(orderId); // เรียกใช้ฟังก์ชัน deleteOrder
    orders.value = orders.value.filter(order => order.id !== orderId); // อัปเดต orders หลังจากลบ
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};

function editOrder(id) {
  router.push({name:'edit',params:{id}})
}

</script>

<template>
    <HeaderFooterLayout>
        <div>
         <p>popup cart</p>
        </div>

        <div class="cart-wrapper">
    <h2>รายการคำสั่งซื้อของคุณ</h2>

    <!-- ตรวจสอบว่ามีคำสั่งซื้อหรือไม่ -->
    <div v-if="orders.length > 0">
      <div v-for="(order, index) in orders" :key="index" class="order-item">
        <p><strong>ประเภทเครื่องดื่ม:</strong> {{ order.temp }}</p>
        <p><strong>Bottoming:</strong> {{ order.bottoming }}</p>
        <p><strong>Base:</strong> {{ order.base }}</p>
        <p><strong>Flavor:</strong> {{ order.flavor }}</p>
        <p><strong>Topping:</strong> {{ order.topping }}</p>
        <button @click="removeOrder(order.id)" class="btn">ลบ</button> <!-- ปุ่มลบ -->
        <button @click="editOrder(order.id)" class="btn">แก้ไข</button> <!-- ปุ่มแก้ไข -->
        <hr>
      </div>
    </div>

    <!-- กรณีไม่มีคำสั่งซื้อ -->
    <div v-else>
      <p>ยังไม่มีคำสั่งซื้อ</p>
    </div>
  </div>
    </HeaderFooterLayout>
</template>
