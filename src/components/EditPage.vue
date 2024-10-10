<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router"; // Import useRoute to access route params
import { getItems } from "../lib/fetch"; // Import getItems to fetch data

// Variables
const route = useRoute();
const selectedMenuItem = ref(null);
const menuItems = ref([]);

// Function to fetch menu items
async function fetchMenu() {
  const coffeeMenu = await getItems(
    `${import.meta.env.VITE_BASE_URL}/coffeeMenu`
  );
  const teaMenu = await getItems(`${import.meta.env.VITE_BASE_URL}/teaMenu`);
  const milkMenu = await getItems(`${import.meta.env.VITE_BASE_URL}/milkMenu`);

  menuItems.value = [...coffeeMenu, ...teaMenu, ...milkMenu];

  // Find the selected drink based on route params
  const drinkName = route.params.name;
  selectedMenuItem.value = menuItems.value.find(
    (item) => item.name === drinkName
  );
}

// Fetch menu on component load
fetchMenu();

// Save and cancel functions
const saveEdit = () => {
  console.log("Changes saved:", selectedMenuItem.value);
  alert("Changes saved successfully.");
};

const cancelEdit = () => {
  console.log("Edit canceled");
  alert("Edit canceled.");
};
</script>

<template>
  <div v-if="selectedMenuItem" class="edit-page">
    <h1>Edit Drink</h1>
    <div>
      <img :src="selectedMenuItem.image" :alt="selectedMenuItem.name" />
      <p>
        Name: <strong>{{ selectedMenuItem.name }}</strong>
      </p>
      <p>
        Drink Type:
        <select v-model="selectedMenuItem.drinkType">
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
        </select>
      </p>
      <p>
        Sweetness:
        <select v-model="selectedMenuItem.sweetness">
          <option value="0%">0%</option>
          <option value="25%">25%</option>
          <option value="50%">50%</option>
          <option value="75%">75%</option>
          <option value="100%">100%</option>
        </select>
      </p>
      <button @click="saveEdit">Save Changes</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.edit-page {
  padding: 20px;
}
.edit-page img {
  max-width: 100%;
  height: auto;
}
</style>
