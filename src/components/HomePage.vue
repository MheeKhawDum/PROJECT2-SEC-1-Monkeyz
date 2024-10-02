<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router"
import HeaderFooterLayout from './Header.vue';

const router = useRouter()

// Data for different pages
const home = ref(true);
const menu = ref(false);
const custom = ref(false);
const drinkOption = ref(false);

// Sample coffee menu data with image paths
const coffeeMenu = ref([
  { id: 1, name: "Latte", image: "../picture/latte.png", price: 50 },
  {
    id: 2,
    name: "Espresso",
    image: "../picture/espresso.png",
    price: 40,
  },
  // Add other menu items...
]);

// Function to open different pages
const openPage = (page) => {
  home.value = false;
  menu.value = false;
  custom.value = false;
  drinkOption.value = false;

  if (page === "menu") {
    menu.value = true;
  } else if (page === "custom") {
    custom.value = true;
  } else if (page === "drinkOption") {
    drinkOption.value = true;
  } else {
    home.value = true;
  }
};

// Function to handle selecting a drink option
const drinkOptionsItem = (drink) => {
  console.log("Selected drink:", drink);
  // Perform logic for selecting the drink option (e.g., set the selected item, navigate to the options page)
};
</script>

<template>

<HeaderFooterLayout>
    <template #sidebar>
        <li><a href="#" @click="router.push({name: 'menuPage'})">Menu</a></li>
        <li><a href="#" @click="router.push({name: 'home'})">Home</a></li>
      </template>
  <!-- home page -->
  <div  class="relative bg-orange-100">
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
            taste will please coffee lovers still ready to serve a variety that
            you can customize according to your needs for the desired taste"
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
        src="../picture/espresso_coffee-removebg-preview.png"
        @click="
          drinkOptionsItem(coffeeMenu[1]);
          openPage('drinkOption');
        "
      />
    </div>
  </div>
  
</HeaderFooterLayout>
</template>