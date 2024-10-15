<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getItems, addOrder } from "../lib/fetch";
import Notification from './notification/Notification.vue'; // Import the notification component

const route = useRoute();
const router = useRouter();
const selectedMenuItem = ref(null);
const menuItems = ref([]);
const selectedSweetness = ref("50%"); // Default sweetness
const selectedDrinkType = ref("hot"); // Default drink type
const notificationVisible = ref(false); // Notification visibility
const notificationMessage = ref(''); // Notification message

// Fetch menu items
async function fetchMenu() {
  const coffeeMenu = await getItems(
    `${import.meta.env.VITE_BASE_URL}/coffeeMenu`
  );
  const teaMenu = await getItems(`${import.meta.env.VITE_BASE_URL}/teaMenu`);
  const milkMenu = await getItems(`${import.meta.env.VITE_BASE_URL}/milkMenu`);

  menuItems.value = [...coffeeMenu, ...teaMenu, ...milkMenu];

  const drinkName = route.params.name;
  selectedMenuItem.value = menuItems.value.find(
    (item) => item.name === drinkName
  );
}

// Call the fetch function when the component is loaded
fetchMenu();

// Function to navigate back to menu
function openMenu() {
  router.push({ name: "menuPage" });
}

// Function to submit and open cart popup
async function openCart() {
  const orderDetails = {
    ...selectedMenuItem.value,
    sweetness: selectedSweetness.value,
    drinkType: selectedDrinkType.value,
    type: "normal",
  };
  try {
    const response = await addOrder(orderDetails);
    console.log(response.message);

    // Show notification
    notificationMessage.value = response.message; // Set the message from response
    notificationVisible.value = true; // Show the notification

    // Redirect to cart after a short delay
    setTimeout(() => {
      router.push({ name: "cart" });
    }, 2000); // 2 seconds delay for user to see the notification

  } catch (error) {
    console.error("Error submitting order:", error);
  }
}
</script>

<template>
  <div v-if="selectedMenuItem" class="drink-option-container bg-orange-100">
    <div class="drink-option">
      <h1 class="text-slate-950 text-xl font-bold">
        {{ selectedMenuItem.name }}
      </h1>
      <img
        :src="selectedMenuItem.image"
        :alt="selectedMenuItem.name"
        class="drink-image"
      />
      <p class="drink-price">Price: {{ selectedMenuItem.price }} THB</p>

      <div class="option-group">
        <label>Select Sweetness:</label>
        <select v-model="selectedSweetness" class="custom-select">
          <option value="0%">0%</option>
          <option value="25%">25%</option>
          <option value="50%">50%</option>
          <option value="75%">75%</option>
          <option value="100%">100%</option>
        </select>
      </div>

      <div class="option-group">
        <label>Select Drink Type:</label>
        <select v-model="selectedDrinkType" class="custom-select">
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
        </select>
      </div>

      <div class="button-group">
        <button @click="openMenu" class="back-btn">Back</button>
        <button @click="openCart" class="submit-btn">Submit</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Drink not found.</p>
    <button @click="openMenu">Back</button>
  </div>
  
  <!-- Notification Component -->
  <Notification
    :visible="notificationVisible"
    @close="notificationVisible = false"
  >
    <template #icon>
      <span>🔔</span>
    </template>
    <template #content>
      <p>{{ notificationMessage }}</p>
    </template>
  </Notification>
</template>

<style scoped>
.drink-option-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.drink-option {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 400px;
}

.drink-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

.drink-price {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 20px;
}

.option-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 1em;
  color: #555;
}

.custom-select {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.custom-select:focus {
  outline: none;
  border-color: #ff9900;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.back-btn {
  background-color: #ccc;
  color: black;
}

.submit-btn {
  background-color: #ff9900;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>
