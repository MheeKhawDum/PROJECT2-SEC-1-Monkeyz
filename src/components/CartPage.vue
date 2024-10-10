<script setup>
import { ref } from "vue";
import DrinkOption from "./DrinkOptions.vue";
import CartPopup from "./CartPopup.vue";

const cartItems = ref([]);
const showCartPopup = ref(false);

// Function to add item to the cart
function addToCart(item) {
  cartItems.value.push({
    ...item,
    quantity: 1, // Add default quantity
  });
  toggleCartPopup();
}

// Function to toggle cart popup visibility
function toggleCartPopup() {
  showCartPopup.value = !showCartPopup.value;
}
</script>
<template>
  <div>
    <!-- Render the DrinkOption component -->
    <DrinkOption @addToCart="addToCart" />

    <!-- Render CartPopup and pass selectedCartItems as props -->
    <CartPopup
      v-if="showCartPopup"
      :cartItems="cartItems"
      @closePopup="toggleCartPopup"
    />
  </div>
</template>
<style scoped></style>
