<script setup>
import { ref, computed, onMounted } from "vue";
import { getOrders, deleteOrder } from '../lib/fetch.js'; // นำเข้าฟังก์ชัน getOrders จาก fetch.js
import { useRouter } from "vue-router";

const router = useRouter();
const cartPopup = ref(true); // Control visibility of cart popup
const cartItems = ref([]); // Array holding cart items

onMounted(async () => {
  await loadOrders();
});

const loadOrders = async () => {
  try {
    const data = await getOrders(); // เรียกใช้ฟังก์ชัน getOrders เพื่อดึงข้อมูล
    cartItems.value = data; // เก็บข้อมูลที่ได้ลงใน orders
  } catch (error) {
    console.error("Error loading orders:", error);
  }
};

// ฟังก์ชันสำหรับลบคำสั่งซื้อ
const removeOrder = async (orderId) => {
  try {
    await deleteOrder(orderId); // เรียกใช้ฟังก์ชัน deleteOrder
    cartItems.value = cartItems.value.filter(order => order.id !== orderId); // อัปเดต orders หลังจากลบ
    loadOrders();
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};

// ฟังก์ชันแก้ไขคำสั่งซื้อ
function editOrder(item) {
  // Check the type of the order
  if (item.type === 'custom') {
    // Navigate to custom edit page (ensure the name matches your router)
    router.push({ name: 'editCustom', params: { id: item.id } });
  } else {
    // Navigate to normal edit page
    router.push({ name: 'edit', params: { id: item.id } });
  }
}


// คำนวณราคารวม
const totalPrice = computed(() =>
  cartItems.value.reduce((total, item) => {
    const price = item.price;  // Default to 0 if price is undefined
    return total + price;
  }, 0)
);

// ฟังก์ชันเพิ่มจำนวนสินค้า
function addQuantity(id) {
  const item = cartItems.value.find((item) => item.id === id);
  if (item) item.quantity++;
}

// ฟังก์ชันลดจำนวนสินค้า
function decreaseQuantity(id) {
  const item = cartItems.value.find((item) => item.id === id);
  if (item && item.quantity > 1) item.quantity--;
}

// ฟังก์ชันสั่งซื้อ
function placeOrder() {
  // Implement your order logic
  alert("Order placed!");
  cartItems.value = []; // Clear cart after order
  openCartPopup();
}

// เปิด/ปิด popup cart
function openCartPopup() {
  cartPopup.value = !cartPopup.value;
}
function closeCartPopup() {
  router.push({ name: 'menuPage' });
}
</script>

<template>
  <div
    v-show="cartPopup"
    class="fixed inset-0 z-20 flex items-center justify-center"
  >
    <!-- Overlay for background -->
    <div
      class="bg-black bg-opacity-50 absolute inset-0"
      @click="openCartPopup"
    ></div>

    <!-- Modal content for cart -->
    <div
      class="modal-box relative z-30 p-5 bg-white rounded shadow-lg w-[35%] h-[50%]"
    >
      <div class="flex flex-col space-y-2">
        <h2 class="text-lg font-bold">Your Cart</h2>
        <p>Number of Items: {{ cartItems.length }}</p>

        <!-- List all items in the cart -->
        <div
          v-for="(item, index) in cartItems"
          :key="index"
          class="bg-gray-300 flex justify-between items-center p-2"
        >
          <div class="flex items-center">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-12 h-12 object-cover"
            />
            <div class="ml-2">
              <p>{{ item.name }}</p>
              <p>{{ item.drinkType }}, {{ item.sweetness }}</p>
              <p>{{ item.price }} THB</p>
            </div>
          </div>
          <div class="flex items-center">
            <button @click="addQuantity(item.id)" class="px-2">+</button>
            <span class="mx-2">Qty: {{ item.quantity }}</span>
            <button @click="decreaseQuantity(item.id)" class="px-2">-</button>
          </div>
          <button @click="removeOrder(item.id)" class="text-red-600">
            Remove
          </button>
          <button @click="editOrder(item)" class="text-blue-600">
            Edit
          </button>
        </div>

        <!-- Display total price -->
        <div class="text-right">Total Price: {{ totalPrice }} THB</div>

        <!-- Action buttons -->
        <div class="mt-4 flex justify-between">
          <button
            @click="placeOrder"
            class="bg-green-500 text-white px-4 py-2 rounded"
          >
            Place Order
          </button>
          <button
            @click="closeCartPopup"
            class="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
