<script setup>
import { ref } from "vue";

// Data for the selected menu item (this would likely be passed as a prop or fetched from a store)
const selectedMenuItem = ref({
  name: "Latte",
  drinkType: "hot",
  sweetness: "50%",
  image: "../picture/latte.png", // Update image path
  basePrice: 50, // base price for the drink
});

// Function to calculate the total price based on the drink type
const priceEdit = () => {
  let price = selectedMenuItem.value.basePrice;

  if (selectedMenuItem.value.drinkType === "cold") {
    price += 10; // add 10 THB for cold drinks
  }

  return price;
};

// Function to save the edited changes
const saveEdit = () => {
  // Logic to save the edited drink (could involve updating a store or making an API call)
  console.log("Changes saved:", selectedMenuItem.value);
  alert("Changes saved successfully.");
};

// Function to cancel the edit and revert changes
const cancelEdit = () => {
  // Logic to handle cancellation (could involve resetting the data or navigating to a different page)
  console.log("Edit canceled");
  alert("Edit canceled.");
};
</script>

<template>
  <div>
    <p>edit page</p>
  </div>
</template>
