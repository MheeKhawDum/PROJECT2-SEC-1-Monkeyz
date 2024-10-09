<script setup>
import { ref } from "vue";

// State for popup and cart items
const cartPopup = ref(false);
const cartItems = ref([]);
const totalPrice = ref(0);
const selectedMenuItem = ref({
  id: null,
  name: null,
  description: null,
  image: null,
  drinkType: null,
  sweetness: null,
  quantity: null,
});

// Toggle cart popup visibility
function openCartPopup() {
  cartPopup.value = !cartPopup.value;
}

// Generate unique ID for items
let tempId = 0;
function generateUniqueId() {
  return ++tempId;
}

// Add a drink to the cart
function addDrinkToCart() {
  if (!selectedMenuItem.value.drinkType || !selectedMenuItem.value.sweetness) {
    alert("Please select an option.");
    return;
  }

  const itemPrice = priceEdit();
  const existingItem = cartItems.value.find(
    item =>
      item.name === selectedMenuItem.value.name &&
      item.drinkType === selectedMenuItem.value.drinkType &&
      item.sweetness === selectedMenuItem.value.sweetness
  );

  if (existingItem) {
    updateExistingItem(existingItem, itemPrice);
  } else {
    addNewItem(itemPrice);
  }

  clearSelectedMenuItem();
  updateTotalPrice();
  openCartPopup();
}

// Add new item to the cart
function addNewItem(itemPrice) {
  const newItem = {
    ...selectedMenuItem.value,
    id: generateUniqueId(),
    price: itemPrice,
    quantity: 1,
    totalpriceByOrder: itemPrice,
  };
  cartItems.value.push(newItem);
}

// Update quantity for existing item
function updateExistingItem(existingItem, itemPrice) {
  existingItem.quantity++;
  existingItem.totalpriceByOrder += itemPrice;
}

// Edit an item in the cart
function editCartItem(index) {
  selectedMenuItem.value = { ...cartItems.value[index] };
  openCartPopup();
}

// Save edited item back to cart
function saveEdit() {
  const indexToEdit = cartItems.value.findIndex(
    (item) => item.id === selectedMenuItem.value.id
  );

  if (indexToEdit !== -1) {
    const updatedPrice = priceEdit();
    const editedItem = {
      ...selectedMenuItem.value,
      price: updatedPrice,
      totalpriceByOrder: updatedPrice * selectedMenuItem.value.quantity,
    };
    cartItems.value[indexToEdit] = editedItem;
    updateTotalPrice();
  }

  clearSelectedMenuItem();
  openCartPopup();
}

// Remove an order from cart
function removeOrder(orderId) {
  cartItems.value = cartItems.value.filter((item) => item.id !== orderId);
  updateTotalPrice();
}

// Increase quantity of an item
function addQuantity(checkId) {
  const item = cartItems.value.find(item => item.id === checkId);
  if (item) {
    item.quantity++;
    item.totalpriceByOrder += item.price;
    updateTotalPrice();
  }
}

// Decrease quantity of an item
function deleteQuantity(checkId) {
  const item = cartItems.value.find(item => item.id === checkId);
  if (item) {
    item.quantity--;
    item.totalpriceByOrder -= item.price;
    if (item.quantity === 0) {
      removeOrder(checkId);
    }
    updateTotalPrice();
  }
}

// Calculate price difference based on drink type
function priceEdit() {
  return selectedMenuItem.value.drinkType === "cold"
    ? selectedMenuItem.value.price + 10
    : selectedMenuItem.value.price;
}

// Update total price
function updateTotalPrice() {
  totalPrice.value = cartItems.value.reduce(
    (sum, item) => sum + item.totalpriceByOrder,
    0
  );
}

// Clear selected item for new selections
function clearSelectedMenuItem() {
  selectedMenuItem.value = {
    id: null,
    name: null,
    description: null,
    image: null,
    drinkType: null,
    sweetness: null,
    quantity: null,
  };
}

// Handle closing modal
function handleClose() {
  openCartPopup();
}

// Place order function
function placeOrder() {
  if (cartItems.value.length > 0) {
    alert("Order placed successfully");
    cartItems.value = []; // Clear cart after placing order
    totalPrice.value = 0;
    openCartPopup();
  }
}

</script>

<template>
  <div class="bg-black bg-opacity-50 absolute inset-0"></div>
  <div class="modal-box relative z-30 p-5 bg-white rounded shadow-lg w-[35%] h-[50%]">
    <p>popup cart</p>
  </div>
</template>