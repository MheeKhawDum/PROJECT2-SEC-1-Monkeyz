<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getOrdersbyId, editOrder } from "../lib/fetch";

const router = useRouter();
const route = useRoute();

const editId = route.params.id;
const cartData = ref({
  id: "",
  drinkType: "",
  sweetness: "",
  category: "",
  flavor: "",
  topping: "",
  type: "",
  name: "",
  quantity: "",
  price: 0,
  // Add other keys as necessary
});

// ฟังก์ชันดึงข้อมูลจาก cart
async function fetchCartData() {
  const orders = await getOrdersbyId(editId); // Fetch cart data
  console.log("Orders:", orders);

  // Update the cartData properties with the fetched order data
  cartData.value = { ...orders }; // Use spread operator to map values
  changeDrinkType(cartData.value.drinkType); // Update cup colors based on the drink type
}

// เรียกใช้งานตอนโหลดหน้า
fetchCartData();

const questions = ref([
  {
    id: 1,
    question: "เลือกประเภทเครื่องดื่ม",
    key: "drinkType",
    options: [
      { option: "hot", price: 0 },
      { option: "cold", price: 10 },
    ],
  },
  {
    id: 2,
    question: "เลือก ความหวาน",
    key: "sweetness",
    options: [
      { option: "50%", price: 0 },
      { option: "75%", price: 0 },
      { option: "100%", price: 0 },
    ],
  },
  {
    id: 3,
    question: "เลือก Base",
    key: "category",
    options: [
      { option: "coffee", price: 40 },
      { option: "tea", price: 40 },
      { option: "milk", price: 40 },
    ],
  },
  {
    id: 4,
    question: "เลือก Flavor",
    key: "flavor",
    options: [
      { option: "chocolate", price: 10 },
      { option: "strawberry", price: 10 },
      { option: "vanilla", price: 10 },
    ],
  },
  {
    id: 5,
    question: "เลือก Topping",
    key: "topping",
    options: [
      { option: "gummy", price: 10 },
      { option: "whip cream", price: 15 },
      { option: "cookie", price: 20 },
    ],
  },
]);
const backgroundColor = ref("#fff7b7"); // สีพื้นหลังเมื่อเป็นเครื่องดื่มร้อน
const hotColors = {
  layer4: "#ffcc80",
  layer3: "#ffb74d",
  layer2: "#ffa726",
  layer1: "#ff9800",
};
const coldColors = {
  layer4: "#80dfff",
  layer3: "#4dcfff",
  layer2: "#26bfff",
  layer1: "#00aaff",
};
const whiteColor = "#ffffff";
const cupColors = ref({
  layer1: whiteColor,
  layer2: whiteColor,
  layer3: whiteColor,
  layer4: whiteColor,
});

const fillLevel = ref(4);
const activeColors = ref(hotColors);

// อัปเดตสีของแก้วเครื่องดื่มตามประเภท
function updateCupColors() {
  const levels = ["layer1", "layer2", "layer3", "layer4"];
  levels.forEach((layer, index) => {
    cupColors.value[layer] =
      index < fillLevel.value ? activeColors.value[layer] : whiteColor;
  });
}

function changeDrinkType(type) {
  cartData.value.drinkType = type;
  if (type === "hot") {
    activeColors.value = hotColors;
    backgroundColor.value = "#fff7b7"; // เปลี่ยนสีพื้นหลังเมื่อเป็นเครื่องดื่มร้อน
  } else {
    activeColors.value = coldColors;
    backgroundColor.value = "#b1e0ff"; // เปลี่ยนสีพื้นหลังเมื่อเป็นเครื่องดื่มเย็น
  }
  updateCupColors();
}

function calculateTotalPrice() {
  let basePrice = 0;

  questions.value.forEach((question) => {
    const selectedOption = question.options.find(
      (option) => option.option === cartData.value[question.key]
    );
    if (selectedOption) {
      basePrice += selectedOption.price;
    }
  });

  cartData.value.price = basePrice;
}

// เรียกใช้อัปเดตสีแก้วเครื่องดื่มครั้งแรก
updateCupColors();

const saveEdit = () => {
  try {
    // คำนวณราคาก่อนบันทึก
    calculateTotalPrice();

    // บันทึกการแก้ไขคำสั่งซื้อ
    const editOrderID = editOrder(editId, cartData.value);
    console.log("Order Edited:", editOrderID);

    // หลังจากบันทึกเสร็จ ย้ายไปหน้า cart
    router.push({ name: "cart" });
  } catch (error) {
    console.error("Error saving order:", error);
  }
};

function cancelEdit() {
  console.log("Edit canceled");
  alert("Edit canceled.");
  router.push({ name: "menuPage" });
}
</script>

<template>
  <div class="edit-container">
    <h1>Submit Your Drink</h1>

    <!-- Drink Preview Section -->
    <div class="drink-preview" :style="{ backgroundColor: backgroundColor }">
      <div class="cup">
        <div
          class="cup-layer"
          :style="{ height: '25%', backgroundColor: cupColors.layer4 }"
        ></div>
        <div
          class="cup-layer"
          :style="{ height: '25%', backgroundColor: cupColors.layer3 }"
        ></div>
        <div
          class="cup-layer"
          :style="{ height: '25%', backgroundColor: cupColors.layer2 }"
        ></div>
        <div
          class="cup-layer"
          :style="{ height: '25%', backgroundColor: cupColors.layer1 }"
        ></div>
      </div>
    </div>

    <!-- Form Section -->
    <form @submit.prevent class="form-section">
      <div v-for="question in questions" :key="question.id" class="form-group">
        <label class="form-label">{{ question.question }}</label>
        <div class="options">
          <div
            v-for="option in question.options"
            :key="option.option"
            class="option"
          >
            <input
              type="radio"
              :id="`${question.key}-${option.option}`"
              :name="question.key"
              :value="option.option"
              v-model="cartData[question.key]"
              @change="
                question.key === 'drinkType' &&
                  changeDrinkType(cartData.drinkType)
              "
              class="hidden-radio"
            />
            <label
              :for="`${question.key}-${option.option}`"
              class="styled-radio"
            >
              {{ option.option }}
            </label>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button type="button" @click="saveEdit" class="save-btn">Submit</button>
        <button type="button" @click="cancelEdit" class="cancel-btn">
          Back
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.edit-container {
  width: 100%;
  height: auto;
  padding: 10px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: xx-large;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.form-section {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex-direction: column;
}

.form-label {
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.option {
  display: flex;
  align-items: center;
}

.styled-radio {
  background-color: #f0f0f0;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.styled-radio:hover {
  background-color: #ddd;
}

input[type="radio"]:checked + .styled-radio {
  background-color: #ffae00;
  color: white;
}

.hidden-radio {
  display: none;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.save-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.cancel-btn {
  background-color: #ff4444;
  color: white;
}

.save-btn:hover,
.cancel-btn:hover {
  opacity: 0.9;
}
.drink-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  border-radius: 50%;
  width: 300px;
  height: 300px;
  margin: 0 auto 40px;
}

.cup {
  height: 200px;
  width: 150px;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);
  overflow: hidden;
}

.cup-layer {
  width: 100%;
}
</style>
