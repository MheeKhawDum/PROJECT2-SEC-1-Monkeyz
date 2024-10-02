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
  <!-- cart pop-up -->
  <div
    v-show="cartPopup"
    class="fixed inset-0 z-20 flex items-center justify-center"
  >
    <div
      class="bg-black bg-opacity-50 absolute inset-0"
      @click="openCartPopup()"
    ></div>
    <div
      class="modal-box relative z-30 p-5 bg-white rounded shadow-lg w-[35%] h-[50%]"
    >
      <div class="flex flex-col space-y-2">
        <p>Number Order :{{ cartItems.length }}</p>
        <div v-for="(order, index) in cartItems" :key="index">
          <div class="bg-gray-300 flex justify-between items-center">
            <div class="flex items-center">
              <img
                :src="order.image"
                :alt="order.name"
                class="menu-item-image"
              />
              <div class="m-2">
                <p>{{ order.name }}</p>
                <p>{{ order.drinkType }}, {{ order.sweetness }}</p>
                <p>{{ order.price + 'THB' }}</p>
              </div>
            </div>
            <p class="cursor-pointer" @click="AddQuantity(order.id)">+</p>
            Quantity: {{ order.quantity }}
            <p class="cursor-pointer" @click="DeleteQuantity(order.id)">-</p>
            <button class="cursor-pointer" @click="editCartItem(index)">
              Edit
            </button>
            <button
              class="text-gray-600 transition hover:text-red-600 cursor-pointer"
            >
              <svg
                @click="removeOrder(order.id)"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
 
      <!-- close button -->
      <div class="space-y-4 text-center">
        <div class="text-right">
          Price :
          {{ totalPrice + 'THB' }}
        </div>
        <div>
          <a
            class="block rounded bg-green-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600 cursor-pointer"
            @click="placeOrder"
            v-show="cartItems.length > 0"
          >
            Place Order
          </a>
 
          <!-- Modal -->
          <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
              <h1>Thank You for Your Order!</h1>
              <p>Your order has been placed successfully.</p>
            </div>
          </div>
        </div>
 
        <a
          class="block rounded border border-gray-600 px-5 py-3 text-sm text-gray-600 transition hover:ring-1 hover:ring-gray-400 cursor-pointer"
          @click="handleClose"
        >
          Close
        </a>
 
        <a
          class="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600 cursor-pointer"
          @click="handleClose"
        >
          Continue shopping
        </a>
      </div>
    </div>
  </div>
</template>