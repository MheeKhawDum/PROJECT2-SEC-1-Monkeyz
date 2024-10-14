<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getOrdersbyId, editOrder } from '../lib/fetch';

const router = useRouter();
const route = useRoute()

const editId = route.params.id
const cartData = ref({
      id: "",
      drinkType: "",
      sweetness: "",
      category: "",
      flavor: "",
      topping: "",
      type: "",
      name: ""
  // Add other keys as necessary
});


// ฟังก์ชันดึงข้อมูลจาก cart
async function fetchCartData() {
    const orders = await getOrdersbyId(editId); // Fetch cart data
    console.log("Orders:", orders);
    
    // Update the cartData properties
    cartData.value.id = orders.id;
    cartData.value.drinkType = orders.drinkType;
    cartData.value.sweetness = orders.sweetness;
    cartData.value.category = orders.category;
    cartData.value.flavor = orders.flavor;
    cartData.value.topping = orders.topping;
    cartData.value.type = orders.type;
    cartData.value.name = orders.name;
    // Add other keys as necessary
    changeDrinkType(cartData.value.drinkType);
}

// เรียกใช้งานตอนโหลดหน้า
fetchCartData();

const questions = ref([
  { id: 1, question: "เลือกประเภทเครื่องดื่ม", key: 'drinkType', options: ["hot", "cold"] },
  { id: 2, question: "เลือก ความหวาน", key: 'sweetness', options: ["50%", "75%", "100%"] },
  { id: 3, question: "เลือก Base", key: 'category', options: ["coffee", "tea", "milk"] },
  { id: 4, question: "เลือก Flavor", key: 'flavor', options: ["chocolate", "strawberry", "vanilla"] },
  { id: 5, question: "เลือก Topping", key: 'topping', options: ["gummy", "whip cream", "cookie"] },
]);

// const answers = ref({
//   drinkType: "hot",
//   bottoming: "black pearl",
//   category: "coffee",
//   flavor: "chocolate",
//   topping: "whip cream",
//   sweetness: "50%",
//   type: 'custom',
//   name: 'custom'
// });

const backgroundColor = ref('#fff7b7'); // สีพื้นหลังเมื่อเป็นเครื่องดื่มร้อน
const hotColors = { layer4: '#ffcc80', layer3: '#ffb74d', layer2: '#ffa726', layer1: '#ff9800' };
const coldColors = { layer4: '#80dfff', layer3: '#4dcfff', layer2: '#26bfff', layer1: '#00aaff' };
const whiteColor = '#ffffff';
const cupColors = ref({ layer1: whiteColor, layer2: whiteColor, layer3: whiteColor, layer4: whiteColor });

const fillLevel = ref(4);
const activeColors = ref(hotColors);

// อัปเดตสีของแก้วเครื่องดื่มตามประเภท
function updateCupColors() {
  const levels = ['layer1', 'layer2', 'layer3', 'layer4'];
  levels.forEach((layer, index) => {
    cupColors.value[layer] = index < fillLevel.value ? activeColors.value[layer] : whiteColor;
  });
}

function changeDrinkType(type) {
  cartData.value.drinkType = type;
  if (type === "hot") {
    activeColors.value = hotColors;
    backgroundColor.value = '#fff7b7'; // เปลี่ยนสีพื้นหลังเมื่อเป็นเครื่องดื่มร้อน
  } else {
    activeColors.value = coldColors;
    backgroundColor.value = '#b1e0ff'; // เปลี่ยนสีพื้นหลังเมื่อเป็นเครื่องดื่มเย็น
  }
  updateCupColors();
}

// เรียกใช้อัปเดตสีแก้วเครื่องดื่มครั้งแรก
updateCupColors();

const saveEdit = () => {
  try {
  const editOrderID = editOrder(editId, cartData.value);
  console.log("Order Edited:", editOrderID);
  router.push({ name: "cart" });    
  } catch (error) {
    console.error("Error saving order:", error);
  }
};

function cancelEdit() {
  console.log("Edit canceled");
  alert("Edit canceled.");
  router.push({name: 'cart'})
}
</script>


<template>
  <div class="edit-container">
    <h1>แก้ไขการสั่งเครื่องดื่ม</h1>

    <!-- แสดงสีแก้ว -->
    <div class="background" :style="{ backgroundColor: backgroundColor }">
      <div class="container">
        <div class="cup">
          <div class="cup-layer" :style="{ height: '25%', backgroundColor: cupColors.layer4 }"></div>
          <div class="cup-layer" :style="{ height: '25%', backgroundColor: cupColors.layer3 }"></div>
          <div class="cup-layer" :style="{ height: '25%', backgroundColor: cupColors.layer2 }"></div>
          <div class="cup-layer" :style="{ height: '25%', backgroundColor: cupColors.layer1 }"></div>
        </div>
      </div>
    </div>

    <form @submit.prevent>
  <div v-for="question in questions" :key="question.id" class="form-group">
    <label>{{ question.question }}</label>
    <div class="options">
      <div v-for="option in question.options" :key="option" class="option">
        <input
          type="radio"
          :id="`${question.key}-${option}`"
          :name="question.key"
          :value="option"
          v-model="cartData[question.key]"
          @change="question.key === 'drinkType' && changeDrinkType(cartData.drinkType)"
        />
        <label :for="`${question.key}-${option}`">{{ option }}</label>
      </div>
    </div>
  </div>

  <!-- Prevent form submission -->
  <button type="button" @click="saveEdit">Save Changes</button>
  <button type="button" @click="cancelEdit">Cancel</button>
</form>

  </div>
</template>

<style scoped>
.edit-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.option {
  display: flex;
  align-items: center;
}

.cup-layer {
  width: 100%;
  height: 25%;
}

.background {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
}

.container {
  height: 37.5em;
  width: 31.25em;
  position: relative;
}

.cup {
  height: 15.62em;
  width: 11.87em;
  background-color: rgba(255, 255, 255, 0);
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  top: 15.62em;
  clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);
  overflow: hidden;
}
</style>
