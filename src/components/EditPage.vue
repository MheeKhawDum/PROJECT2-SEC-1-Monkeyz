<script setup>
import { ref } from 'vue';

// Data for the selected menu item (this would likely be passed as a prop or fetched from a store)
const selectedMenuItem = ref({
  name: 'Latte',
  drinkType: 'hot',
  sweetness: '50%',
  image: '../picture/latte.png', // Update image path
  basePrice: 50, // base price for the drink
});

// Function to calculate the total price based on the drink type
const priceEdit = () => {
  let price = selectedMenuItem.value.basePrice;

  if (selectedMenuItem.value.drinkType === 'cold') {
    price += 10; // add 10 THB for cold drinks
  }

  return price;
};

// Function to save the edited changes
const saveEdit = () => {
  // Logic to save the edited drink (could involve updating a store or making an API call)
  console.log('Changes saved:', selectedMenuItem.value);
  alert('Changes saved successfully.');
};

// Function to cancel the edit and revert changes
const cancelEdit = () => {
  // Logic to handle cancellation (could involve resetting the data or navigating to a different page)
  console.log('Edit canceled');
  alert('Edit canceled.');
};
</script>


<template>
  <!-- Edit Page -->
  <div v-show="edit" class="bg-orange-100 flex flex-col min-h-screen p-6">
    <div class="flex-grow flex flex-col items-center">
      <h1 class="text-3xl mb-6 text-black font-bold">Edit Drink</h1>
 
      <div class="flex justify-center mb-6">
        <img
          class="w-40 h-40 object-cover rounded-2xl shadow-2xl"
          :src="selectedMenuItem.image"
          :alt="selectedMenuItem.name"
        />
      </div>
 
      <h2 class="text-xl mb-4 text-black font-semibold">
        Menu: {{ selectedMenuItem.name }}
      </h2>
 
      <form class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div class="mb-6">
          <label class="block text-lg font-medium text-gray-900 mb-2"
            >Drink Type:</label
          >
          <div class="flex gap-4">
            <div class="flex items-center cursor-pointer">
              <input
                type="radio"
                id="Hot"
                v-model="selectedMenuItem.drinkType"
                value="hot"
                class="cursor-pointer"
              />
              <label for="Hot" class="ml-2 text-gray-700">Hot</label>
            </div>
            <div class="flex items-center cursor-pointer">
              <input
                type="radio"
                id="Cold"
                v-model="selectedMenuItem.drinkType"
                value="cold"
                class="cursor-pointer"
              />
              <label for="Cold" class="ml-2 text-gray-700">Cold(+10THB)</label>
            </div>
          </div>
        </div>
 
        <div class="mb-6">
          <label class="block text-lg font-medium text-gray-900 mb-2"
            >Sweetness:</label
          >
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center cursor-pointer">
              <input
                type="radio"
                id="Sweetness0"
                v-model="selectedMenuItem.sweetness"
                value="0%"
                class="cursor-pointer"
              />
              <label for="Sweetness0" class="ml-2 text-gray-700">0%</label>
            </div>
            <div class="flex items-center cursor-pointer">
              <input
                type="radio"
                id="Sweetness25"
                v-model="selectedMenuItem.sweetness"
                value="25%"
                class="cursor-pointer"
              />
              <label for="Sweetness25" class="ml-2 text-gray-700">25%</label>
            </div>
            <div class="flex items-center cursor-pointer">
              <input
                type="radio"
                id="Sweetness50"
                v-model="selectedMenuItem.sweetness"
                value="50%"
                class="cursor-pointer"
              />
              <label for="Sweetness50" class="ml-2 text-gray-700">50%</label>
            </div>
            <div class="flex items-center cursor-pointer">
              <input
                type="radio"
                id="Sweetness75"
                v-model="selectedMenuItem.sweetness"
                value="75%"
                class="cursor-pointer"
              />
              <label for="Sweetness75" class="ml-2 text-gray-700">75%</label>
            </div>
            <div class="flex items-center cursor-pointer">
              <input
                type="radio"
                id="Sweetness100"
                v-model="selectedMenuItem.sweetness"
                value="100%"
                class="cursor-pointer"
              />
              <label for="Sweetness100" class="ml-2 text-gray-700">100%</label>
            </div>
            <!-- Total Price Section -->
            <div class="text-center mt-6">
              <h2 class="text-xl font-semibold">
                Total Price: {{ priceEdit() }} THB
              </h2>
            </div>
          </div>
        </div>
 
        <div class="flex justify-between mt-6">
          <button
            type="button"
            @click="saveEdit"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            @click="cancelEdit"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
 