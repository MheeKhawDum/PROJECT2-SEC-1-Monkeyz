<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const cartPopup = ref(true); // Control visibility of cart popup
const cartItems = ref([]); // Array holding cart items

// Computed total price based on cart items
const totalPrice = computed(() =>
  cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
);

// Function to add item quantity
function addQuantity(id) {
  const item = cartItems.value.find((item) => item.id === id);
  if (item) item.quantity++;
}

// Function to decrease item quantity
function decreaseQuantity(id) {
  const item = cartItems.value.find((item) => item.id === id);
  if (item && item.quantity > 1) item.quantity--;
}

// Function to remove item from cart
function removeItem(id) {
  cartItems.value = cartItems.value.filter((item) => item.id !== id);
}

// Function to place order
function placeOrder() {
  // Implement your order logic
  alert("Order placed!");
  cartItems.value = []; // Clear cart after order
  openCartPopup();
}

// Toggle cart popup visibility
function openCartPopup() {
  cartPopup.value = !cartPopup.value;
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
          <button @click="removeItem(item.id)" class="text-red-600">
            Remove
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
            @click="openCartPopup"
            class="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
