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
  <div v-if="menubyId" class="edit-page bg-orange-100">
    <!-- <h1>Edit Drink</h1> -->
    <div class="edit-container">
      <img :src="menubyId.image" :alt="menubyId.name" class="drink-image" />
      <p class="text-slate-950">
        Name: <strong>{{ menubyId.name }}</strong>
      </p>

      <p>
        Drink Type:
        <select v-model="menubyId.drinkType" class="custom-select">
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
        </select>
      </p>

      <p>
        Sweetness:
        <select v-model="menubyId.sweetness" class="custom-select">
          <option value="0%">0%</option>
          <option value="25%">25%</option>
          <option value="50%">50%</option>
          <option value="75%">75%</option>
          <option value="100%">100%</option>
        </select>
      </p>

      <div class="button-group">
        <button @click="saveEdit" class="save-btn">Save Changes</button>
        <button @click="cancelEdit" class="cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.edit-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.edit-container {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

.drink-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

.custom-select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1em;
}

.custom-select:focus {
  outline: none;
  border-color: #ff9900;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.save-btn {
  background-color: #ff9900;
  color: white;
}

.cancel-btn {
  background-color: #ccc;
  color: black;
}

button:hover {
  opacity: 0.9;
}
</style>
