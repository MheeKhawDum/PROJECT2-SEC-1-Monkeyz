<script setup>
import { ref, computed, onMounted } from "vue";
import {
  getOrders,
  deleteOrder,
  addHistory,
  updateOrder,
} from "../lib/fetch.js"; // นำเข้าฟังก์ชัน getOrders จาก fetch.js
import { useRouter } from "vue-router";
import Notification from "./notification/Notification.vue"; // Import the notification component

const router = useRouter();
const cartPopup = ref(true); // Control visibility of cart popup
const cartItems = ref([]); // Array holding cart items
const couponCode = ref(""); // ตัวแปรสำหรับเก็บคูปอง
const discountMessage = ref(""); // ตัวแปรสำหรับข้อความส่วนลด
const isDiscountApplied = ref(false); // ตัวแปรเพื่อตรวจสอบว่ามีการใช้ส่วนลดหรือไม่
const notificationMessage = ref("");
const showNotification = ref(false);

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
    await deleteOrder(orderId);
    cartItems.value = cartItems.value.filter((order) => order.id !== orderId);

    // แสดงการแจ้งเตือนเมื่อมีการลบ
    notificationMessage.value = "Item removed from the cart";
    showNotification.value = true;
    setTimeout(() => {
      showNotification.value = false; // ซ่อนการแจ้งเตือนหลังจาก 3 วินาที
    }, 3000);

    loadOrders();
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};

// ฟังก์ชันแก้ไขคำสั่งซื้อ
function editOrder(item) {
  // Check the type of the order
  if (item.type === "custom") {
    // Navigate to custom edit page (ensure the name matches your router)
    router.push({ name: "editCustom", params: { id: item.id } });
  } else {
    // Navigate to normal edit page
    router.push({ name: "edit", params: { id: item.id } });
  }
}

const applyDiscount = () => {
  const totalQuantity = cartItems.value.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const normalizedCouponCode = couponCode.value.trim().toLowerCase(); // แปลงคูปองเป็นตัวพิมพ์เล็ก

  if (!normalizedCouponCode) {
    discountMessage.value = "กรุณากรอกรหัสคูปอง"; // Message when no coupon is entered
    isDiscountApplied.value = false;
    return;
  }

  // ตรวจสอบว่าจำนวนแก้วครบ 5 แก้วหรือไม่
  if (totalQuantity >= 5 && normalizedCouponCode === "discount20") {
    discountMessage.value = "คุณได้รับส่วนลด 20%!"; // ข้อความยืนยันส่วนลด
    isDiscountApplied.value = true; // ตั้งค่าว่ามีการใช้ส่วนลด
  } else if (normalizedCouponCode !== "discount20" && normalizedCouponCode) {
    discountMessage.value = "ส่วนลดไม่ถูกต้อง"; // ข้อความสำหรับกรณีคูปองไม่ถูกต้อง
    isDiscountApplied.value = false; // ไม่ใช้ส่วนลด
  } else if (normalizedCouponCode) {
    discountMessage.value = "จำนวนแก้วไม่พอที่จะใช้ส่วนลด"; // ข้อความสำหรับกรณีไม่ครบ
    isDiscountApplied.value = false; // ไม่ใช้ส่วนลด
  } else {
    discountMessage.value = ""; // ล้างข้อความหากไม่มีคูปอง
    isDiscountApplied.value = false; // ไม่ใช้ส่วนลด
  }
};

const discount = (totalPrice, totalQuantity) => {
  if (isDiscountApplied.value) {
    return totalPrice * 0.8; // ลดราคา 20%
  }
  return totalPrice; // ส่งคืนราคาปกติ
};

const totalPrice = computed(() => {
  const totalQuantity = cartItems.value.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const total = cartItems.value.reduce((total, item) => {
    const price = item.price ? item.price : 0; // ตรวจสอบว่ามี price หรือไม่
    return total + price * item.quantity;
  }, 0);
  return discount(total, totalQuantity); // ส่งจำนวนสินค้าไปที่ฟังก์ชัน discount
});

// ฟังก์ชันเพิ่มจำนวนสินค้า
async function addQuantity(id) {
  const item = cartItems.value.find((item) => item.id === id);
  if (item) {
    item.quantity++;
    await updateOrder(item); // อัปเดตข้อมูลใน backend ทันทีหลังจากเพิ่ม quantity
  }
}

// ฟังก์ชันลดจำนวนสินค้า
async function decreaseQuantity(id) {
  const item = cartItems.value.find((item) => item.id === id);
  if (item && item.quantity > 1) {
    item.quantity--;
    await updateOrder(item); // อัปเดตข้อมูลใน backend ทันทีหลังจากลด quantity
  }
}

async function placeOrder() {
  try {
    const addHistoryResponse = await addHistory(cartItems.value);

    if (addHistoryResponse.resCode === 201) {
      for (let item of cartItems.value) {
        await deleteOrder(item.id);
      }
      cartItems.value = [];

      // แสดงการแจ้งเตือนเมื่อสั่งซื้อสำเร็จ
      notificationMessage.value = "Order placed and cart cleared!";
      showNotification.value = true;
      setTimeout(() => {
        showNotification.value = false; // ซ่อนการแจ้งเตือนหลังจาก 3 วินาที
        openCartPopup(); // นำทางไปที่หน้า menuPage หลังจากการแจ้งเตือน
      }, 3000);
    } else {
      console.error("Error adding to history");
    }
  } catch (error) {
    console.error("Error placing order:", error);
  }
}

// เปิด/ปิด popup cart
function openCartPopup() {
  router.push({ name: "menuPage" });
}
function closeCartPopup() {
  router.push({ name: "menuPage" });
}
</script>

<template>
  <div
    v-show="cartPopup"
    class="fixed inset-0 z-20 flex items-center justify-center bg-orange-100"
  >
    <!-- Overlay for background -->
    <div class="absolute inset-0" @click="openCartPopup"></div>

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
          <button @click="editOrder(item)" class="text-blue-600">Edit</button>
        </div>

        <!-- ช่องกรอกคูปอง -->
        <div class="flex items-center mt-4 space-x-2">
          <input
            type="text"
            v-model="couponCode"
            placeholder="Enter coupon code"
            class="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="applyDiscount"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            Apply
          </button>
        </div>

        <p
          v-if="
            cartItems.length > 0 &&
            cartItems.reduce((sum, item) => sum + item.quantity, 0) >= 5
          "
        >
          Use this coupon: <span class="font-bold">"discount20"</span> to get
          20% off!
        </p>
        <!-- แสดงข้อความส่วนลด -->
        <div v-if="discountMessage" class="text-red-500">
          {{ discountMessage }}
        </div>

        <!-- Display total price -->
        <div class="text-right">Total Price: {{ totalPrice }} THB</div>

        <!-- Action buttons -->
        <div class="mt-4 flex justify-between">
          <button
            @click="placeOrder()"
            :disabled="cartItems.length === 0"
            :class="{
              'bg-gray-300 cursor-not-allowed': cartItems.length === 0,
              'bg-green-500': cartItems.length > 0,
            }"
            class="text-white px-4 py-2 rounded"
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
    <Notification :visible="showNotification" @close="showNotification = false">
      <template #icon>
        <span class="text-red-500">⚠️</span>
      </template>
      <template #content>
        <div>{{ notificationMessage }}</div>
      </template>
    </Notification>
  </div>
</template>
