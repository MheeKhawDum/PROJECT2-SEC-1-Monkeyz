<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getOrdersbyId, editOrder } from "../lib/fetch";

const route = useRoute();
const router = useRouter();
const menubyId = ref(null);
const drinkId = route.params.id;

// Fetch menu item by ID
async function fetchMenu() {
  if (drinkId) {
    try {
      menubyId.value = await getOrdersbyId(drinkId);
      console.log(menubyId.value); // Debugging the fetched data
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }
}

function saveEdit() {
  try {
    const editOrderID = editOrder(drinkId, menubyId.value);
    console.log("Order saved:", editOrderID);
    alert("Changes saved successfully.");
    router.push({ name: "menuPage" });
  } catch (error) {
    console.error("Error saving order:", error);
  }
}

function cancelEdit() {
  console.log("Edit canceled");
  alert("Edit canceled.");
  router.push({ name: "cart" });
}

onMounted(fetchMenu);
</script>

<template>
  <div v-if="menubyId" class="edit-page">
    <h1>Edit Drink</h1>
    <div>
      <img :src="menubyId.image" :alt="menubyId.name" />
      <p>
        Name: <strong>{{ menubyId.name }}</strong>
      </p>
      <p>
        Drink Type:
        <select v-model="menubyId.drinkType">
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
        </select>
      </p>
      <p>
        Sweetness:
        <select v-model="menubyId.sweetness">
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
