import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getItems } from '../lib/fetch';

export const useMenuStore = defineStore('menu', () => {
  const listCoffee = ref([]);
  const listTea = ref([]);
  const listMilk = ref([]);
  const isLoading = ref(true);
  const errorMessage = ref('');

  async function fetchData() {
    try {
      isLoading.value = true;
      listCoffee.value = await getItems(`${import.meta.env.VITE_BASE_URL}/coffeeMenu`);
      listTea.value = await getItems(`${import.meta.env.VITE_BASE_URL}/teaMenu`);
      listMilk.value = await getItems(`${import.meta.env.VITE_BASE_URL}/milkMenu`);
    } catch (error) {
      console.error(error);
      errorMessage.value = 'Failed to load menu items. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  return {
    listCoffee,
    listTea,
    listMilk,
    isLoading,
    errorMessage,
    fetchData,
  };
});
