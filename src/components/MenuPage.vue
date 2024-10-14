<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import HeaderFooterLayout from "./Header.vue";
import { getMenu, getItems } from "../lib/fetch";

const router = useRouter();
const isLoading = ref(true);
const errorMessage = ref("");

const listCoffee = ref({});
const listTea = ref({});
const listMilk = ref({});

// ฟังก์ชันดึงข้อมูลจาก db.json
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
    <div class="menu-page">
      <!-- แสดงข้อความระหว่างการโหลด -->
      <div v-if="isLoading" class="loading">Loading menu...</div>

      <!-- แสดงข้อผิดพลาดหากมี -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <!-- Coffee Menu -->
      <div v-if="listCoffee.length">
        <h1>Coffee</h1>
        <div class="menu-grid">
          <div>
            <div
              v-for="(item, index) in listCoffee"
              :key="index"
              class="menu-item"
              @click="openDrinkOption(item.name)"
            >
              <p>{{ item.name }} - {{ item.price }} THB</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tea Menu -->
      <div v-if="listTea.length">
        <h1>Tea</h1>
        <div class="menu-grid">
          <div
            v-for="(item, index) in listTea"
            :key="index"
            class="menu-item"
            @click="openDrinkOption(item.name)"
          >
            <p>{{ item.name }} - {{ item.price }} THB</p>
          </div>
        </div>
      </div>

      <!-- Milk Menu -->
      <div v-if="listMilk.length">
        <h1>Milk</h1>
        <div class="menu-grid">
          <div
            v-for="(item, index) in listMilk"
            :key="index"
            class="menu-item"
            @click="openDrinkOption(item.name)"
          >
            <p>{{ item.name }} - {{ item.price }} THB</p>
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

.loading {
  text-align: center;
  font-size: 1.2em;
  color: #ff9900;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 1.2em;
  margin-bottom: 20px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.menu-item {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>
