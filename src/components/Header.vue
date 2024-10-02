<script setup>
import { ref } from "vue";

</script>

<template>
    <div class="flex flex-col h-screen">
      <!-- Header Section -->
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
            <label for="my-drawer" class="drawer-overlay"></label>
            <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <label for="my-drawer" class="cursor-pointer">
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
              <!-- Sidebar Slot -->
              <slot name="sidebar"></slot>
            </ul>
          </div>
        </div>
  
        <div class="flex-1">
          <!-- Title Slot -->
          <slot name="title">
            <a class="btn btn-ghost text-xl text-white justify-start">Monkeys-Fresh</a>
          </slot>
        </div>
  
        <!-- Cart Button Slot -->
        <div class="flex-none">
          <slot name="cart">
            <button class="btn btn-square btn-ghost bg-white rounded-xl">
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
          </slot>
        </div>
      </div>
  
      <!-- Main Content Slot -->
      <div class="flex-grow">
        <slot></slot>
      </div>
  
      <!-- Footer Section -->
      <footer class="footer footer-center text-base-content p-4 bg-orange-400 mt-auto">
        <slot name="footer">
          <p class="text-white">Monkeys-Fresh Group ©</p>
        </slot>
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