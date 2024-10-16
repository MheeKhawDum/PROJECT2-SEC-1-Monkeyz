<script setup>
import { ref, computed, onMounted } from "vue";
import { getOrders, deleteOrder, addHistory } from '../lib/fetch.js'; // นำเข้าฟังก์ชัน getOrders จาก fetch.js
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
    addNewItem(itemPrice);
  }

  clearSelectedMenuItem();
  updateTotalPrice();
  openCartPopup();
}

// Add new item to the cart
function addNewItem(itemPrice) {
  const newItem = {
    ...selectedMenuItem.value,
    id: generateUniqueId(),
    price: itemPrice,
    quantity: 1,
    totalpriceByOrder: itemPrice,
  };
  cartItems.value.push(newItem);
}

// Update quantity for existing item
function updateExistingItem(existingItem, itemPrice) {
  existingItem.quantity++;
  existingItem.totalpriceByOrder += itemPrice;
}

// Edit an item in the cart
function editCartItem(index) {
  selectedMenuItem.value = { ...cartItems.value[index] };
  openCartPopup();
}

// Save edited item back to cart
function saveEdit() {
  const indexToEdit = cartItems.value.findIndex(
    (item) => item.id === selectedMenuItem.value.id
  );

  if (indexToEdit !== -1) {
    const updatedPrice = priceEdit();
    const editedItem = {
      ...selectedMenuItem.value,
      price: updatedPrice,
      totalpriceByOrder: updatedPrice * selectedMenuItem.value.quantity,
    };
    cartItems.value[indexToEdit] = editedItem;
    updateTotalPrice();
  }

  clearSelectedMenuItem();
  openCartPopup();
}

// Remove an order from cart
function removeOrder(orderId) {
  cartItems.value = cartItems.value.filter((item) => item.id !== orderId);
  updateTotalPrice();
}

// Increase quantity of an item
function addQuantity(checkId) {
  const item = cartItems.value.find(item => item.id === checkId);
  if (item) {
    item.quantity++;
    item.totalpriceByOrder += item.price;
    updateTotalPrice();
  }
}

// Decrease quantity of an item
function deleteQuantity(checkId) {
  const item = cartItems.value.find(item => item.id === checkId);
  if (item) {
    item.quantity--;
    item.totalpriceByOrder -= item.price;
    if (item.quantity === 0) {
      removeOrder(checkId);
    }
    updateTotalPrice();
  }
}

// Calculate price difference based on drink type
function priceEdit() {
  return selectedMenuItem.value.drinkType === "cold"
    ? selectedMenuItem.value.price + 10
    : selectedMenuItem.value.price;
}

// Update total price
function updateTotalPrice() {
  totalPrice.value = cartItems.value.reduce(
    (sum, item) => sum + item.totalpriceByOrder,
    0
  );
}

// Clear selected item for new selections
function clearSelectedMenuItem() {
  selectedMenuItem.value = {
    id: null,
    name: null,
    description: null,
    image: null,
    drinkType: null,
    sweetness: null,
    quantity: null,
  };
}

// Handle closing modal
function handleClose() {
  openCartPopup();
}

// Place order function
function placeOrder() {
  if (cartItems.value.length > 0) {
    alert("Order placed successfully");
    cartItems.value = []; // Clear cart after placing order
    totalPrice.value = 0;
    openCartPopup();
  }
}

</script>

<template>
  <div>
    <p>popup cart</p>
  </div>
</template>
