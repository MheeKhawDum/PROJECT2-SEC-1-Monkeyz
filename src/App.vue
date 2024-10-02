<script setup>
import { ref } from "vue";
import homepage from "@/components/HomePage.vue"
import { useRoute, useRouter } from "vue-router"

// State variables for page management
const home = ref(true);
const menu = ref(false);
const custom = ref(false);
const cartPopupVisible = ref(false);
const router = useRouter()

// Function to open different pages
const openPage = (page) => {
  home.value = false;
  menu.value = false;
  custom.value = false;

  if (page === "menu") {
    menu.value = true;
  } else if (page === "custom") {
    custom.value = true;
  } else {
    home.value = true;
  }
};

// Function to open cart popup
const openCartPopup = () => {
  cartPopupVisible.value = !cartPopupVisible.value; // Toggle the cart popup visibility
  console.log("Cart popup visibility:", cartPopupVisible.value);
};

// Optional: You can define a method to close the cart popup if needed
const closeCartPopup = () => {
  cartPopupVisible.value = false;
};

function routeNa(){
    router.push({name: 'menuPage'})
    console.log('1')
}
</script>

<template>
    <router-view></router-view>
  
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