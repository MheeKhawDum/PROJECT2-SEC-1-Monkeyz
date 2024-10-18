<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import HeaderFooterLayout from "./Header.vue";
import { getMenu, getItems } from "../lib/fetch";

const router = useRouter();
const isLoading = ref(true);
const errorMessage = ref("");

const listCoffee = ref({});
const listTea = ref({});
const listMilk = ref({});
const listHistory = ref({});
const listTempHistory = ref([]);
const listCustomAndQuantityFilter = ref([]);
const listRecommended = ref([])

// ฟังก์ชันดึงข้อมูลจาก API
async function fetchData() {
  try {
    // isLoading.value = true;

    listCoffee.value = await getItems(
      `${import.meta.env.VITE_BASE_URL}/coffeeMenu`
    );
    listTea.value = await getItems(`${import.meta.env.VITE_BASE_URL}/teaMenu`);
    listMilk.value = await getItems(
      `${import.meta.env.VITE_BASE_URL}/milkMenu`
    );
    listHistory.value = await getItems(
      `${import.meta.env.VITE_BASE_URL}/history`
    );

    listHistory.value.forEach((item) => {
      listTempHistory.value.push(item.items[0]);
    });

    console.log(listTempHistory.value);

    const customItemCount = {};

    listTempHistory.value.forEach((item) => {
      if (item.name === "custom") {
        const key = `${item.drinkType}-${item.sweetness}-${item.category}-${item.flavor}-${item.topping}`;

        // เพิ่มจำนวนถ้ารายการมีอยู่แล้วหรือตั้งเป็น 1 ถ้าไม่มี
        if (customItemCount[key]) {
          customItemCount[key].quantity += item.quantity;
        } else {
          customItemCount[key] = { ...item, quantity: item.quantity };
        }
      }
    });

    // add the calculated value to ListCustomAndQuantityFilter
    listCustomAndQuantityFilter.value = Object.values(customItemCount)

    listRecommended.value = listCustomAndQuantityFilter.value.sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    console.log(listCustomAndQuantityFilter.value);
    console.log("↑ all custom items ------- top3 most ordered custom item ↓")
    console.log(listRecommended.value);
    
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to load menu items. Please try again.";
  } finally {
    isLoading.value = false;
  }
}



function openDrinkOption(menuItem) {
  router.push({
    name: "drinkOption",
    params: { name: menuItem },
  });
}
fetchData();
</script>

<template>
  <HeaderFooterLayout>
    <!-- Slot สำหรับ sidebar -->
    <template #sidebar>
      <li><router-link :to="{ name: 'menuPage' }">Menu</router-link></li>
      <li><router-link :to="{ name: 'home' }">Home</router-link></li>
    </template>

    <!-- Main content -->
    <div class="menu-page h-full bg-orange-100">
      <!-- Loading and Error Messages -->
      <div v-if="isLoading" class="loading">Loading menu...</div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <!-- Coffee Menu -->
      <div v-if="listCoffee.length" class="menu-section">
        <h2 class="text-2xl font-bold text-slate-950">Coffee</h2>
        <div class="menu-slider">
          <div
            v-for="(item, index) in listCoffee"
            :key="index"
            class="menu-item"
            @click="openDrinkOption(item.name)"
          >
            <img :src="item.image" :alt="item.name" class="menu-item-image" />
            <p class="menu-item-name">{{ item.name }}</p>
            <p class="menu-item-price">{{ item.price }} THB</p>
          </div>
        </div>
      </div>

      <!-- Tea Menu -->
      <div v-if="listTea.length" class="menu-section">
        <h2 class="text-2xl font-bold text-slate-950">Tea</h2>
        <div class="menu-slider">
          <div
            v-for="(item, index) in listTea"
            :key="index"
            class="menu-item"
            @click="openDrinkOption(item.name)"
          >
            <img :src="item.image" :alt="item.name" class="menu-item-image" />
            <p class="menu-item-name">{{ item.name }}</p>
            <p class="menu-item-price">{{ item.price }} THB</p>
          </div>
        </div>
      </div>

      <!-- Milk Menu -->
      <div v-if="listMilk.length" class="menu-section">
        <h2 class="text-2xl font-bold text-slate-950">Milk</h2>
        <div class="menu-slider">
          <div
            v-for="(item, index) in listMilk"
            :key="index"
            class="menu-item"
            @click="openDrinkOption(item.name)"
          >
            <img :src="item.image" :alt="item.name" class="menu-item-image" />
            <p class="menu-item-name">{{ item.name }}</p>
            <p class="menu-item-price">{{ item.price }} THB</p>
          </div>
        </div>
      </div>

      <!-- Recommended Menu -->
      <div v-if="listRecommended.length" class="menu-section">
        <h2 class="text-2xl font-bold text-slate-950">
          Recommended Custom Menu
        </h2>
        <div class="menu-slider">
          <div
            v-for="(item, index) in listRecommended"
            :key="index"
            class="menu-item"
            @click="openDrinkOption(item.name)"
          >
            <img :src="item.image" :alt="item.name" class="menu-item-image" />
            <p>base: {{ item.category }}</p>
            <p>flavor: {{ item.flavor }}</p>
            <p>topping: {{ item.topping }}</p>
            <!-- <p class="menu-item-name">{{ item.name }}</p>
            <p class="menu-item-price">{{ item.price }} THB</p> -->
          </div>
        </div>
      </div>
    </div>
  </HeaderFooterLayout>
</template>

<style scoped>
.menu-page {
  padding: 20px;
}

.loading,
.error-message {
  text-align: center;
  font-size: 1.5em;
  color: #ff9900;
}

.menu-section {
  margin-bottom: 40px;
}

.menu-slider {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding-bottom: 10px;
  scrollbar-width: none; /* Hide scrollbar for Firefox */
}

.menu-slider::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
}

.menu-item {
  min-width: 150px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.menu-item:hover {
  transform: scale(1.05);
}

.menu-item-image {
  width: 125px;
  height: 140px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.menu-item-name {
  font-size: 1.2em;
  margin-bottom: 5px;
  color: #333;
}

.menu-item-price {
  font-size: 1em;
  color: #777;
}
</style>
