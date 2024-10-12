<script setup>
import { ref } from "vue";
import { useRoute , useRouter} from "vue-router";
import { getOrdersbyId , editOrder} from "../lib/fetch";
const route = useRoute();
const router = useRouter()
const editId = route.params.id;
const menuItems = ref([]); // ตัวแปรสำหรับเก็บรายการเครื่องดื่มทั้งหมด
const cartmenu = ref(null)
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
  const editOrderbyId = editOrder(editId,cartmenu.value)
  console.log(editOrderbyId);
  router.push({name: 'cart'})
  // alert("Changes saved successfully.");
};

// Function to cancel the edit and revert changes
const cancelEdit = () => {
  // Logic to handle cancellation (could involve resetting the data or navigating to a different page)
  console.log("Edit canceled");
  alert("Edit canceled.");
};

async function fetchOrder() {
 cartmenu.value = await getOrdersbyId(editId);


  console.log(cartmenu);
  console.log(cartmenu.id)

}
fetchOrder()
</script>

<template>
  <div v-if="cartmenu" class="edit-page">
    <h1>Edit Drink</h1>
    <div>
      <img :src="cartmenu.image" :alt="cartmenu.name" />
      <p>
        Name: <strong>{{ cartmenu.name }}</strong>
      </p>
      <p>
        Drink Type:
        <select v-model="cartmenu.drinkType">
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
        </select>
      </p>
      <p>
        Sweetness:
        <select v-model="cartmenu.sweetness">
          <option value="0%">0%</option>
          <option value="25%">25%</option>
          <option value="50%">50%</option>
          <option value="75%">75%</option>
          <option value="100%">100%</option>
        </select>
      </p>
      <button @click="saveEdit">Save Changes</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>
