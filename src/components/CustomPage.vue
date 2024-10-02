<script setup>
import { ref, computed } from 'vue';

// Data for bases, flavors, and toppings
const bases = ref([
  { name: 'Coffee', price: 50, image: '../picture/coffee.png' },
  { name: 'Tea', price: 40, image: '../picture/tea.png' },
  { name: 'Milk', price: 45, image: '../picture/milk.png' }
]);

const flavors = ref(['Vanilla', 'Caramel', 'Hazelnut']);
const toppings = ref([
  { name: 'Whipped Cream', price: 10 },
  { name: 'Pearls', price: 15 },
  { name: 'Jelly', price: 10 }
]);

// Custom drink data
const customDrink = ref({
  base: '',
  flavors: [],
  toppings: '',
  drinkType: '',
  sweetness: '',
  price: 0
});

// Computed property for custom drink image based on selected base
const customDrinkImage = computed(() => {
  const selectedBase = bases.value.find(base => base.name === customDrink.value.base);
  return selectedBase ? selectedBase.image : '';
});

// Computed property for total price calculation
const customDrinkTotalPrice = computed(() => {
  let totalPrice = 0;
  const selectedBase = bases.value.find(base => base.name === customDrink.value.base);
  if (selectedBase) {
    totalPrice += selectedBase.price;
  }

  if (customDrink.value.drinkType === 'cold') {
    totalPrice += 10; // Add extra price for cold drinks
  }

  const selectedTopping = toppings.value.find(topping => topping.name === customDrink.value.toppings);
  if (selectedTopping) {
    totalPrice += selectedTopping.price;
  }

  return totalPrice;
});

// Function to add custom drink to the cart
function addCustomDrinkToCart() {
  if (!customDrink.value.base || !customDrink.value.drinkType || !customDrink.value.sweetness) {
    alert('Please complete the form.');
    return;
  }

  const drink = {
    ...customDrink.value,
    totalPrice: customDrinkTotalPrice.value
  };

  // Logic to add the drink to the cart (this depends on how you handle the cart)
  console.log('Drink added to cart:', drink);
  alert('Drink added to cart');
  
  // Reset form after adding to cart
  customDrink.value = {
    base: '',
    flavors: [],
    toppings: '',
    drinkType: '',
    sweetness: '',
    price: 0
  };
}

// Function to open different page (home page in this case)
function openPage(page) {
  console.log(`Opening page: ${page}`);
  // Logic to open a different page
}

</script>


<template>
<!-- Custom Page -->
<div v-show="custom" class="bg-orange-100 flex-grow p-4">
    <div class="flex flex-col items-center">
      <h1 class="text-3xl mb-4 text-black">Create Your Custom Drink</h1>
 
      <!-- Custom Drink Form -->
      <div class="w-full max-w-md bg-white p-4 rounded shadow-md">
        <h2 class="text-xl mb-2 text-center text-gray-900">
          Select Ingredients
        </h2>
 
        <!-- Display Image Based on Selected Base -->
        <div class="mb-4 flex justify-center">
          <img
            :src="customDrinkImage"
            alt="Custom Drink"
            class="w-32 h-32 object-cover rounded"
          />
        </div>
 
<!-- Base Selection -->
<div class="mb-4">
<label
  for="Select Base"
  class="block text-lg font-medium text-gray-900 mb-2"
>
  Select Base
</label>
<select
  v-model="customDrink.base"
  class="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm cursor-pointer p-2"
>
  <option value="">Select a base</option>
  <option v-for="base in bases" :key="base.name" :value="base.name">
    {{ base.name }} ({{ base.price }} THB)
  </option>
</select>
</div>
 
    <!-- Flavors Selection -->
    <div class="mt-4">
      <label class="block mb-2 text-lg font-medium text-gray-900">Select Flavors:</label>
      <div class="flex flex-wrap gap-2">
        <div v-for="flavor in flavors" :key="flavor" class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            :value="flavor"
            v-model="customDrink.flavors"
            class="cursor-pointer"
          />
          <label class="ml-2">{{ flavor }}</label>
        </div>
      </div>
    </div>
 
    <!-- Toppings Selection -->
    <div class="mt-4">
      <label class="block mb-2 text-lg font-medium text-gray-900">Select Topping:</label>
      <select v-model="customDrink.toppings" class="border p-2 rounded-lg w-full cursor-pointer">
        <option value="">Select Topping</option>
        <option
          v-for="topping in toppings"
          :key="topping.name"
          :value="topping.name"
          class="cursor-pointer"
        >
          {{ topping.name }} (+{{ topping.price }} THB)
        </option>
      </select>
    </div>
 
    <!-- Temperature Selection -->
    <div class="mt-4">
      <label class="block mb-2 text-lg font-medium text-gray-900">Select Temperature:</label>
      <div class="flex space-x-4">
        <div class="flex items-center cursor-pointer">
          <input
            type="radio"
            id="Hot"
            value="hot"
            v-model="customDrink.drinkType"
            class="cursor-pointer"
          />
          <label for="hot" class="ml-2">Hot</label>
        </div>
        <div class="flex items-center cursor-pointer">
          <input
            type="radio"
            id="Cold"
            value="cold"
            v-model="customDrink.drinkType"
            class="cursor-pointer"
          />
          <label for="cold" class="ml-2">Cold (+10 THB)</label>
        </div>
      </div>
    </div>
 
        <div class="mt-4">
          <label class="block mb-2">Select Sweetness:</label>
          <select v-model="customDrink.sweetness" class="border p-2 rounded cursor-pointer">
            <option value="">Select sweetness</option>
            <option value="0%">0%</option>
            <option value="25%">25%</option>
            <option value="50%">50%</option>
            <option value="75%">75%</option>
            <option value="100%">100%</option>
          </select>
        </div>
        <!-- Display Total Price -->
        <div class="mt-6">
          <label class="block mb-2 text-lg font-medium text-gray-900"
            >Total Price:</label
          >
          <p class="text-xl font-semibold">
            {{ customDrinkTotalPrice }} Baht
          </p>
        </div>
        <div class="mt-4 flex justify-between">
          <button @click="openPage('home')" class="btn btn-secondary cursor-pointer">
            Back
          </button>
          <button @click="addCustomDrinkToCart" class="btn btn-primary cursor-pointer">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    
  </div></template>