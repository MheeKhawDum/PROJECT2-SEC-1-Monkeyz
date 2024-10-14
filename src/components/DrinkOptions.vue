<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getItems, addOrder } from "../lib/fetch";

const route = useRoute();
const router = useRouter();
const selectedMenuItem = ref(null);
const menuItems = ref([]);
const selectedSweetness = ref("50%"); // Default sweetness
const selectedDrinkType = ref("hot"); // Default drink type

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
function openCart() {
  const orderDetails = {
    ...selectedMenuItem.value,
    sweetness: selectedSweetness.value,
    drinkType: selectedDrinkType.value,
  };
  const response = addOrder(orderDetails);

  router.push({ name: "cart" }); // Pass the order details to cart
}
</script>

<template>
  <div v-if="selectedMenuItem" class="drink-option">
    <h1>{{ selectedMenuItem.name }}</h1>
    <img :src="selectedMenuItem.image" :alt="selectedMenuItem.name" />
    <p>Price: {{ selectedMenuItem.price }} THB</p>

    <p>
      Select Sweetness:
      <select v-model="selectedSweetness">
        <option value="0%">0%</option>
        <option value="25%">25%</option>
        <option value="50%" selected>50%</option>
        <option value="75%">75%</option>
        <option value="100%">100%</option>
      </select>
    </p>

    <p>
      Select Drink Type:
      <select v-model="selectedDrinkType">
        <option value="hot">Hot</option>
        <option value="cold">Cold</option>
      </select>
    </p>

    <button @click="openMenu">Back</button>
    <button @click="openCart">Submit</button>
  </div>
  <div v-else>
    <p>Drink not found.</p>
    <button @click="openMenu">Back</button>
  </div>
</template>

<style scoped></style>
