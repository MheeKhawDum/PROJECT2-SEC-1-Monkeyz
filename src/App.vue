<script setup>
import { ref, computed } from "vue";

const colors = ref(["#957DAD", "#D291BC", "#FFDFD3"]);
const change = ref("");

function randomColor() {
  change.value = colors.value[Math.floor(Math.random() * colors.value.length)];
}
setInterval(randomColor, 1000);

const menu = ref(false);
const home = ref(true);
const custom = ref(false);
const cartPopup = ref(false);
const edit = ref(false);

//drink option pages and functions
const drinkOptions = ref(false);

//For totalAllPrice
const totalPrice = ref(0);

function openCartPopup() {
  cartPopup.value = !cartPopup.value;
}

//open page by user
function openPage(page) {
  if (page === "home") {
    home.value = true;
    menu.value = false;
    custom.value = false;
    drinkOptions.value = false;
    edit.value = false;
  } else if (page === "menu") {
    home.value = false;
    menu.value = true;
    custom.value = false;
    drinkOptions.value = false;
    edit.value = false;
    // Reset the selected menu item when navigating to the menu page
    selectedMenuItem.value = {
      id: null,
      name: null,
      description: null,
      image: null,
      drinkType: null,
      sweetness: null,
      quantity: null,
    };
  } else if (page === "custom") {
    home.value = false;
    menu.value = false;
    custom.value = true;
    drinkOptions.value = false;
    edit.value = false;
  } else if (page === "drinkOption") {
    home.value = false;
    menu.value = false;
    custom.value = false;
    drinkOptions.value = true;
    edit.value = false;
  } else if (page === "edit") {
    home.value = false;
    menu.value = false;
    custom.value = false;
    drinkOptions.value = false;
    edit.value = true;
    cartPopup.value = !cartPopup.value;
  }
}

//store value has been selected by user
const cartItems = ref([]);

// เริ่มต้นจาก 0
let tempId = 0;

// เพิ่มค่า tempId และส่งคืนเป็น id
function generateUniqueId() {
  return ++tempId;
}

let selectedMenuItem = ref({
  id: null,
  name: null,
  description: null,
  image: null,
  drinkType: null,
  sweetness: null,
  quantity: null,
});

//Add drinks to Array Value sselected by user
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
  plusAllPrice();
  openPage("menu");
  openCartPopup();
}

function updateExistingItem(existingItem, itemPrice) {
  existingItem.quantity++;
  existingItem.totalpriceByOrder += itemPrice;
}

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


// Store the selected item from the menu to selectedMenuItem
function drinkOptionsItem(item) {
  selectedMenuItem.value = { ...item };
}

//increase 10 bath if you choose cold menu
function priceEdit() {
  if (selectedMenuItem.value.drinkType === "cold") {
    return selectedMenuItem.value.price + 10;
  }
  return selectedMenuItem.value.price;
}

//increase same menu and option
function AddQuantity(checkid) {
  for (let i = 0; i < cartItems.value.length; i++) {
    if (cartItems.value[i].id == checkid) {
      cartItems.value[i].totalpriceByOrder =
        cartItems.value[i].totalpriceByOrder + cartItems.value[i].price;
      cartItems.value[i].quantity++;
    }
  }
  plusAllPrice();
}

//decrease same menu, option and can delete from cart like remove function when quantity = 0
function DeleteQuantity(checkid) {
  for (let i = 0; i < cartItems.value.length; i++) {
    if (cartItems.value[i].id == checkid) {
      cartItems.value[i].quantity--;
      cartItems.value[i].totalpriceByOrder =
        cartItems.value[i].totalpriceByOrder - cartItems.value[i].price;
      if (cartItems.value[i].quantity == 0) {
        minusAllPrice();
        removeOrder(checkid);
      }
    }
  }
  minusAllPrice();
}

//Used when finished selected menu.
function clearSelectedMenuItem() {
  selectedMenuItem.value = {
    id: null,
    name: null,
    description: null,
    image: null,
    drinkType: null,
    sweetness: null,
  };
}

//increase Price
function plusAllPrice() {
  totalPrice.value = cartItems.value.reduce(
    (sum, item) => sum + item.totalpriceByOrder,
    0
  );
}

//decrease Price
function minusAllPrice() {
  totalPrice.value = cartItems.value.reduce(
    (sum, item) => sum + item.totalpriceByOrder,
    0
  );
}

//List All menu(not custom menu)
const coffeeMenu = ref([
  {
    name: "Capuccino",
    image: "../picture/cappuccino coffee.png",
    price: 40,
  },
  {
    name: "Espresso",
    image: "../picture/espresso coffee.png",
    price: 50,
  },
  {
    name: "Latte",
    image: "../picture/latte coffee.png",
    price: 50,
  },
  {
    name: "Mocha",
    image: "../picture/Mocha_coffe.png",
    price: 50,
  },
  // Add more items as needed
]);

const TeaMenu = ref([
  {
    name: "Green Tea",
    image: "../picture/green tea.png",
    price: 50,
  },
  {
    name: "Matcha Latte",
    image: "../picture/matcha latte.png",
    price: 55,
  },
  {
    name: "Black Tea",
    image: "../picture/black tea.png",
    price: 40,
  },
  {
    name: "Hojicha Tea",
    image: "../picture/hojicha tea.png",
    price: 50,
  },
  {
    name: "Milk tea",
    image: "../picture/milk tea.png",
    price: 50,
  },
  {
    name: "Lemon tea",
    image: "../picture/Lemontea.png",
    price: 50,
  },
  {
    name: "Thai tea",
    image: "../picture/Thai_tea.png",
    price: 50,
  },

  // Add more items as needed
]);

const MilkMenu = ref([
  {
    name: "Fresh Milk",
    image: "../picture/fresh milk.png",
    price: 50,
  },
  {
    name: "Pink Milk",
    image: "../picture/Pink Milk.png",
    price: 50,
  },
]);

//can edit menu in cart.
function editCartItem(index) {
  selectedMenuItem.value = { ...cartItems.value[index] };
  openPage("edit");
}

// ฟังก์ชันบันทึกการแก้ไข
function saveEdit() {
  const indexToEdit = cartItems.value.findIndex(
    (item) => item.id === selectedMenuItem.value.id
  );

  if (indexToEdit !== -1) {
    // คำนวณราคาใหม่
    const oldItem = cartItems.value[indexToEdit];
    let updatedPrice = priceEdit();

    // ตรวจสอบการเปลี่ยนแปลงประเภทเครื่องดื่ม
    if (oldItem.drinkType !== selectedMenuItem.value.drinkType) {
      if (
        selectedMenuItem.value.drinkType === "hot" &&
        oldItem.drinkType === "cold"
      ) {
        updatedPrice = oldItem.price - 10;
      }
      if (
        selectedMenuItem.value.drinkType === "cold" &&
        oldItem.drinkType === "hot"
      ) {
        updatedPrice = oldItem.price + 10;
      }
    }

    // อัปเดต cartItems ด้วยข้อมูลที่แก้ไข
    cartItems.value[indexToEdit] = {
      ...selectedMenuItem.value,
      price: updatedPrice,
      totalpriceByOrder: updatedPrice * selectedMenuItem.value.quantity,
    };

    // เรียกฟังก์ชันคำนวณราคาทั้งหมดใหม่
    plusAllPrice();
  }

  // รีเซ็ต selectedMenuItem
  selectedMenuItem.value = {
    id: null,
    name: null,
    description: null,
    image: null,
    drinkType: null,
    sweetness: null,
  };
  cartPopup.value = true;
  openPage("menu");
}

//removed order from cart
function removeOrder(orderId) {
  cartItems.value = cartItems.value.filter((item) => item.id !== orderId);
  minusAllPrice();
}

//cancel for edit page
function cancelEdit() {
  cartPopup.value = true;
  openPage("menu");
}

const customDrink = ref({
  base: "",
  flavors: [],
  toppings: "", // Change from array to single value
  sweetness: "",
  price: 0,
  drinkType: "",
});

const flavors = ref(["Vanilla", "Chocolate", "Caramel", "Hazelnut", "Mint"]); // Add more flavors if needed
const toppings = ref([
  { name: "Whipped Cream", price: 10 },
  { name: "Chocolate Chips", price: 15 },
  { name: "Cinnamon", price: 5 },
  { name: "Caramel Drizzle", price: 10 },
]);

// Mapping bases to images
const bases = ref([
  { name: "Coffee", image: "../picture/espresso coffee.png", price: 40 },
  { name: "Tea", image: "../picture/tea_base.png", price: 30 },
  { name: "Milk", image: "../picture/milk_base.png", price: 35 },
]);

const toppingCombinationImageMap = {
  // Coffee combinations
  "Coffee-Whipped Cream": "../picture/Coffee_with_Whipped_Cream.png",
  "Coffee-Chocolate Chips": "../picture/CoffeewithChocolateChips.png",
  "Coffee-Cinnamon": "../picture/CoffeewithCinnamon.png",
  "Coffee-Caramel Drizzle": "../picture/CoffeewithCaramelDrizzle.png",

  // Tea combinations
  "Tea-Whipped Cream": "../picture/TeawithWhippedCream.png",
  "Tea-Chocolate Chips": "../picture/Tea_with_Chocolate_Chips.png",
  "Tea-Cinnamon": "../picture/Tea_with_Cinnamon.png",
  "Tea-Caramel Drizzle": "../picture/Tea_with_Caramel_Drizzle.png",

  // Milk combinations
  "Milk-Whipped Cream": "../picture/Milk_with_Whipped_Cream.png",
  "Milk-Chocolate Chips": "../picture/Milk_with_Chocolate_Chips.png",
  "Milk-Cinnamon": "../picture/Milk_with_Cinnamon.png",
  "Milk-Caramel Drizzle": "../picture/Milk_with_Caramel_Drizzle.png",
};

// Computed property for the custom drink image
const customDrinkImage = computed(() => {
  const baseImage =
    bases.value.find((base) => base.name === customDrink.value.base)?.image ||
    "../picture/questionmark.png";

  const toppingKey = `${customDrink.value.base}-${customDrink.value.toppings}`;
  const toppingImage = toppingCombinationImageMap[toppingKey];

  return toppingImage || baseImage;
});

//add custom menu to cartItems(Array to store all menu ha been selected by user)
function addCustomDrinkToCart() {
  // ตรวจสอบว่าผู้ใช้เลือกตัวเลือกทั้งหมด
  if (
    customDrink.value.base &&
    customDrink.value.sweetness
  ) {
    // ดึงราคา base และ topping จาก arrays
    const basePrice =
      bases.value.find((base) => base.name === customDrink.value.base)?.price || 0;
    const toppingPrice =
      toppings.value.find(
        (topping) => topping.name === customDrink.value.toppings
      )?.price || 0;

    // คำนวณราคารวมตามตัวเลือกที่เลือก
    let totalPrice = basePrice; // บวก base price
    totalPrice += toppingPrice; // บวก topping price

    // เพิ่ม 10 บาทถ้าเครื่องดื่มเย็น
    if (customDrink.value.drinkType === "cold") {
      totalPrice += 10;
    }

    // เพิ่มเครื่องดื่มที่กำหนดเองไปยังตะกร้า
    cartItems.value.push({
      name: `Custom ${customDrink.value.base}`,
      description: `Base: ${
        customDrink.value.base
      }, Flavors: ${customDrink.value.flavors.join(", ")}, Topping: ${
        customDrink.value.toppings
      }, Sweetness: ${customDrink.value.sweetness}`,
      image: customDrinkImage.value,
      base: customDrink.value.base,
      flavors: customDrink.value.flavors,
      toppings: customDrink.value.toppings,
      sweetness: customDrink.value.sweetness,
      id: generateUniqueId(),
      price: totalPrice, // ใช้ราคาที่คำนวณแล้ว
      quantity: 1,
      totalpriceByOrder: totalPrice,
      drinkType: customDrink.value.drinkType,
    });

    // รีเซ็ตฟอร์มเครื่องดื่มที่กำหนดเอง
    customDrink.value = {
      base: "",
      flavors: [],
      toppings: "",
      sweetness: "",
      drinkType: "",
    };

    // เปลี่ยนหน้าเป็น 'menu' และแสดง popup ตะกร้า
    plusAllPrice();
    openPage("custom");
    openCartPopup();
  } else {
    alert("Please select base and topping");
  }
}


// Computed property to calculate total price for custom drink
const customDrinkTotalPrice = computed(() => {
  if (!customDrink.value.base) return 0; // Return 0 if no base is selected

  // Get base and topping prices from the arrays
  const basePrice =
    bases.value.find((base) => base.name === customDrink.value.base)?.price ||
    0;
  const toppingPrice =
    toppings.value.find(
      (topping) => topping.name === customDrink.value.toppings
    )?.price || 0;

  // Calculate the price based on selected ingredients
  let totalPrice = basePrice; // Add base price
  // totalPrice += customDrink.value.flavors.length * 5; // Assuming each flavor costs 5
  totalPrice += toppingPrice; // Add topping price

  // Add 10 Baht if the drink is cold
  if (customDrink.value.drinkType === "cold") {
    totalPrice += 10;
  }

  return totalPrice;
});

const showModal = ref(false);

function placeOrder() {

  cartItems.value.forEach(item => {
    removeOrder(item.id);
  });


  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function handleClose() {
  closeModal(); 
  openCartPopup(); 
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="navbar bg-orange-400">
      <div class="drawer w-20">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <label for="my-drawer" class="btn drawer-button btn-outline bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-5 w-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div class="drawer-side z-30">
          <label
            for="my-drawer"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <label
              for="my-drawer"
              aria-label="close-sidebar"
              class="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </label>
            <li><a @click="openPage('menu')">Menu</a></li>
            <li><a @click="openPage('custom')">Custom Your Menu</a></li>
          </ul>
        </div>
      </div>

      <div class="flex-1">
        <a
          class="btn btn-ghost text-xl text-white justify-start"
          @click="openPage('home')"
          >Monkeys-Fresh</a
        >
      </div>

      <!-- cart button -->
      <div class="flex-none">
        <button
          class="btn btn-square btn-ghost bg-white rounded-xl"
          @click="openCartPopup()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 justify-end"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- home page -->
    <section v-show="home" class="relative bg-orange-100">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div
          class="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8"
        >
          <div class="max-w-xl ltr:sm:text-left rtl:sm:text-right">
            <h1
              class="text-3xl text-center font-extrabold sm:text-5xl text-yellow-950"
            >
              Monkeys-Fresh

              <strong class="block font-extrabold text-orange-500">
                drinks just for you
              </strong>
            </h1>

            <p class="text-center mt-4 max-w-lg sm:text-xl/snug text-slate-950">
              “Monkeys-Fresh” drinks are freshly brewed and freshly ground for
              every cup. In the coffee menu, we use 100% Arabica coffee beans,
              selected by award-winning baristas, so you can be sure that the
              taste will please coffee lovers still ready to serve a variety
              that you can customize according to your needs for the desired
              taste"
            </p>

            <div class="mt-8 flex flex-wrap gap-4 text-center cursor-pointer">
              <button
                @click="openPage('menu')"
                class="block rounded-lg px-20 py-6 font-sans text-xl font-extrabold uppercase text-slate-950 transition-all hover:bg-orange-500/50 active:bg-orange-500/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Menu
              </button>

              <a
                @click="openPage('custom')"
                class="block rounded-lg px-20 py-6 font-sans text-xl font-extrabold uppercase text-slate-950 transition-all hover:bg-orange-500/50 active:bg-orange-500/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Custom Menu
              </a>
            </div>
          </div>
        </div>
        <img
          class="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:flex lg:items-center lg:px-20 cursor-pointer"
          src="../public/picture/espresso_coffee-removebg-preview.png"
          @click="
            drinkOptionsItem(coffeeMenu[1]);
            openPage('drinkOption');
          "
        />
      </div>
    </section>

    <!-- menu page -->
    <div name="menu" v-show="menu" class="flex-grow bg-orange-100">
      <div class="menu-section">
        <h2 class="section-title">COFFEE</h2>
        <div class="menu-slider">
          <div
            v-for="item in coffeeMenu"
            :key="item.name"
            class="menu-item text-black"
          >
            <div
              @click="
                drinkOptionsItem(item);
                openPage('drinkOption');
              "
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="menu-item-image cursor-pointer drink-options-image"
              />
              <div class="menu-item-text">
                <p>{{ item.name }}</p>
                <p>{{ item.description }}</p>
                <p>{{ item.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-section">
        <h2 class="section-title">TEA</h2>
        <div class="menu-slider">
          <div
            v-for="item in TeaMenu"
            :key="item.name"
            class="menu-item text-black drink-options-image"
          >
            <div
              @click="
                drinkOptionsItem(item);
                openPage('drinkOption');
              "
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="menu-item-image cursor-pointer drink-options-image"
              />
              <div class="menu-item-text">
                <p>{{ item.name }}</p>
                <p>{{ item.description }}</p>
                <p>{{ item.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-section">
        <h2 class="section-title">MILK</h2>
        <div class="menu-slider">
          <div
            v-for="item in MilkMenu"
            :key="item.name"
            class="menu-item text-black "
          >
            <div
              @click="
                drinkOptionsItem(item);
                openPage('drinkOption');
              "
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="menu-item-image cursor-pointer drink-options-image"
              />
              <div class="menu-item-text">
                <p>{{ item.name }}</p>
                <p>{{ item.description }}</p>
                <p>{{ item.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center cursor-pointer">
        <div class="button" @click="openPage('home')">
          <a>Back</a>
        </div>
      </div>
    </div>
    <div name="custom" v-show="custom"></div>

<!-- Drink Options page -->
<div name="drinkOptions" v-show="drinkOptions" class="bg-orange-100 flex flex-col min-h-screen p-6">
  <!-- Container for content -->
  <div class="flex-grow flex flex-col items-center">
    <!-- Title Section -->
    <h1 class="text-3xl mb-6 text-black font-bold">{{ selectedMenuItem.name }}</h1>
    
    <!-- Image Section -->
    <div class="flex justify-center mb-6">
      <img
        class="w-40 h-40 object-cover rounded-2xl shadow-2xl"
        :src="selectedMenuItem.image"
        :alt="selectedMenuItem.name"
      />
    </div>
    
    <!-- Form for Options -->
    <form class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <!-- Drink Type Selection -->
      <div class="mb-6">
        <label class="block text-lg font-medium text-gray-900 mb-2">Drink Type:</label>
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
            <label for="Cold" class="ml-2 text-gray-700">Cold (+10 THB)</label>
          </div>
        </div>
      </div>
      
      <!-- Sweetness Selection -->
      <div class="mb-6">
        <label class="block text-lg font-medium text-gray-900 mb-2">Sweetness:</label>
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
        </div>
      </div>

      <!-- Total Price Section -->
      <div class="text-center mt-6">
        <h2 class="text-xl font-semibold">Total Price: {{ priceEdit() }} THB</h2>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-between mt-6">
        <button
          type="button"
          @click="addDrinkToCart()"
          class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
        >
          Add to cart
        </button>
        <button
          type="button"
          @click="openPage('menu')"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</div>


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
    </div>
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
              <p>{{ order.price + "THB" }}</p>
            </div>
          </div>
          <p class="cursor-pointer" @click="AddQuantity(order.id)">+</p>
          Quantity: {{ order.quantity }}
          <p class="cursor-pointer" @click="DeleteQuantity(order.id)">-</p>
          <button class="cursor-pointer" @click="editCartItem(index)">Edit</button>
          <button class="text-gray-600 transition hover:text-red-600 cursor-pointer">
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
        {{ totalPrice + "THB" }}
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
        <label class="block text-lg font-medium text-gray-900 mb-2">Drink Type:</label>
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
        <label class="block text-lg font-medium text-gray-900 mb-2">Sweetness:</label>
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
      <h2 class="text-xl font-semibold">Total Price: {{ priceEdit() }} THB</h2>
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
  
  <!-- Footer -->
  <footer class="footer footer-center text-base-content p-4 bg-orange-400 mt-auto">
    <aside>
      <p class="text-white">Monkeys-Fresh Group ©</p>
    </aside>
  </footer>
</div>
</template>

<style scoped>
.drink-options-image {
    margin-bottom: 10px; 
  }
.menu-section {
  margin-top: 20px;
  padding: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  color: rgb(131, 100, 65);
}

.menu-slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 50px;
  padding: 10px;
  scroll-behavior: smooth;
}

.menu-item {
  scroll-snap-align: start;
  min-width: 120px;
  text-align: center;
}

.menu-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 4px 4px 5px;
}

.menu-item-text {
  font-size: 16px;
  font-weight: 500;
}

body {
  text-align: center;
  background-color: #ffcc8e;
}

.button {
  position: relative;
  display: inline-block;
  margin: 20px;
}

.MiniButton {
  margin: 10px;
}

.button a {
  color: white;
  font-family: Helvetica, sans-serif;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  text-decoration: none;
  background-color: #ffa12b;
  display: block;
  position: relative;
  padding: 20px 40px;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  text-shadow: 0px 1px 0px #000;
  filter: dropshadow(color=#000, offx=0px, offy=1px);

  -webkit-box-shadow: inset 0 1px 0 #ffe5c4, 0 10px 0 #915100;
  -moz-box-shadow: inset 0 1px 0 #ffe5c4, 0 10px 0 #915100;
  box-shadow: inset 0 1px 0 #ffe5c4, 0 10px 0 #915100;

  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

.button a:active {
  top: 10px;
  background-color: #f78900;

  -webkit-box-shadow: inset 0 1px 0 #ffe5c4, inset 0 -3px 0 #915100;
  -moz-box-shadow: inset 0 1px 0 #ffe5c4, inset 0 -3pxpx 0 #915100;
  box-shadow: inset 0 1px 0 #ffe5c4, inset 0 -3px 0 #915100;
}

.button:after {
  content: "";
  height: 100%;
  width: 100%;
  padding: 4px;
  position: absolute;
  bottom: -15px;
  left: -4px;
  z-index: -1;
  background-color: #2b1800;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

.drink-image {
  width: 300px; /* Adjusted width */
  height: 300px; /* Adjusted height */
  object-fit: cover;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.menu-name {
  font-size: 2.5rem; 
  font-weight: bold; 
  color: #333; 
  text-align: center; 
  margin-bottom: 20px; 
}
</style>
