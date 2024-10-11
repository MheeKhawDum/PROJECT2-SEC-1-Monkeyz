<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { getOrdersbyId } from "../lib/fetch";
const route = useRoute();
const editId = route.params.id;
const menuItems = ref([]); // ตัวแปรสำหรับเก็บรายการเครื่องดื่มทั้งหมด
// Data for the selected menu item (this would likely be passed as a prop or fetched from a store)
const selectedMenuItem = ref(
 null
);

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

async function fetchOrder() {
  const cartmenu = await getOrdersbyId(editId);

  menuItems.value = [...cartmenu]; // รวมเมนูทั้งหมด
  console.log(menuItems);
  menuItems.value.splice(foundIndex, 1, editedItem) //replace editiing Item

  // selectedMenuItem.value = menuItems.value.find(item => item.id === editId);
  // for (let index = 0; index < cartmenu.length; index++) {
  //   console.log(cartmenu[index].id);
    
  //   if (editId === cartmenu[index].value.id) {
  //     selectedMenuItem = {
  //       id: cartmenu[index].id.value,
  //       temp: cartmenu[index].temp.value,
  //       bottoming: cartmenu[index].bottoming.value,
  //       base: cartmenu[index].base.value,
  //       flavor: cartmenu[index].flavor.value,
  //       topping: cartmenu[index].topping.value,
  //     };
  //   }
  // }
}
fetchOrder()
</script>

<template>
  <div>
    <p>edit page</p>
    {{ selectedMenuItem }}
  </div>
</template>
