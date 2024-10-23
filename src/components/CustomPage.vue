<script setup>
import { ref } from "vue";
import { addOrder } from "../lib/fetch";
import { useRoute, useRouter } from "vue-router";
import Notification from "./notification/Notification.vue"; // Import the notification component
import HeaderFooterLayout from "./Header.vue";
const notificationVisible = ref(false);
const notificationMessage = ref("");
const router = useRouter();

// ตัวแปรสำหรับคำถามและตัวเลือก
const questions = ref([
  {
    id: 1,
    question: "Select Your drink type",
    key: "drinkType",
    options: [
      { option: "hot", price: 0 },
      { option: "cold", price: 10 },
    ],
  },
  {
    id: 2,
    question: "Select Your sweetness",
    key: "sweetness",
    options: [
      { option: "50%", price: 0 },
      { option: "75%", price: 0 },
      { option: "100%", price: 0 },
    ],
  },
  {
    id: 3,
    question: "Select Your Base",
    key: "category",
    options: [
      { option: "coffee", price: 40 },
      { option: "tea", price: 40 },
      { option: "milk", price: 40 },
    ],
  },
  {
    id: 4,
    question: "Select Your Flavor",
    key: "flavor",
    options: [
      { option: "chocolate", price: 10 },
      { option: "strawberry", price: 10 },
      { option: "vanilla", price: 10 },
    ],
  },
  {
    id: 5,
    question: "Select Your Topping",
    key: "topping",
    options: [
      { option: "gummy", price: 10 },
      { option: "whip cream", price: 15 },
      { option: "cookie", price: 20 },
    ],
  },
]);

// เก็บคำตอบของผู้ใช้
const answers = ref({
  drinkType: null,
  sweetness: null,
  category: null,
  flavor: null,
  topping: null,
  type: "custom",
  name: "custom",
  quantity: 1,
  price: 0,
  image: "../picture/mystery_cup.png",
});
const currentQuestionIndex = ref(0);
const clickCount = ref(0);
const isFinished = ref(false); // ตัวแปรเช็คว่าเลือกเสร็จแล้วหรือไม่

// ตัวแปรสำหรับจัดการสีพื้นหลังและแก้ว
const backgroundColor = ref("#fad168");
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

const fillLevel = ref(0);
const maxLayers = ref(4); // กำหนดให้มี 4 เลเยอร์เสมอ
let activeColors = null;

// ฟังก์ชันเปลี่ยนสีแก้ว
function changeColor(type) {
  backgroundColor.value = type === "hot" ? "#fff7b7" : "#b1e0f0";
  activeColors = type === "hot" ? hotColors : coldColors;
  fillLevel.value = 0;
  updateCupColors();
}

// ฟังก์ชันอัปเดตสีแก้ว
function updateCupColors() {
  const levels = ["layer1", "layer2", "layer3", "layer4"];
  levels.forEach((layer, index) => {
    cupColors.value[layer] =
      index < fillLevel.value ? activeColors[layer] : whiteColor;
  });
}

const selectOption = (option) => {
  const questionKey = questions.value[currentQuestionIndex.value].key;
  const previousOption = answers.value[questionKey];

  // ถ้ามีตัวเลือกเก่าอยู่แล้ว ให้ลบราคาของตัวเลือกเก่าออกก่อน
  if (previousOption) {
    const previousPrice = questions.value[
      currentQuestionIndex.value
    ].options.find((opt) => opt.option === previousOption).price;
    answers.value.price -= previousPrice; // ลบราคาของตัวเลือกเก่า
  }

  // บันทึกตัวเลือกใหม่
  answers.value[questionKey] = option.option;
  answers.value.price += option.price; // เพิ่มราคาของตัวเลือกใหม่

  if (currentQuestionIndex.value === 0) {
    changeColor(option.option); // เปลี่ยนสีแก้ว
  } else if (currentQuestionIndex.value >= 1) {
    fillLevel.value = Math.min(fillLevel.value + 1, maxLayers.value);
    updateCupColors();
  }

  clickCount.value++;

  // ไปยังคำถามถัดไปหรือจบการเลือก
  if (currentQuestionIndex.value < questions.value.length) {
    currentQuestionIndex.value++;
  } else {
    isFinished.value = true; // ตั้งค่าเป็น true เมื่อเลือกเสร็จแล้ว
  }
};

const goBack = () => {
  if (currentQuestionIndex.value > 0) {
    const questionKey = questions.value[currentQuestionIndex.value]?.key;
    const currentOption = answers.value[questionKey];

    // ลดราคาจากตัวเลือกปัจจุบัน
    const currentPrice = currentOption
      ? questions.value[currentQuestionIndex.value].options.find(
          (option) => option.option === currentOption
        ).price
      : 0;
    answers.value.price -= currentPrice; // ลดราคา

    answers.value[questionKey] = null; // ลบคำตอบของคำถามปัจจุบัน

    // ตรวจสอบการเปลี่ยนจากเย็นเป็นร้อนและลบ 10 บาท
    if (currentQuestionIndex.value === 1) {
      const previousOption = answers.value["drinkType"];
      if (previousOption === "cold") {
        answers.value.price -= 10; // ลบ 10 บาทถ้าเปลี่ยนจากเย็นเป็นร้อน
      }
    }

    currentQuestionIndex.value--; // ย้อนกลับไปยังคำถามก่อนหน้า

    if (currentQuestionIndex.value >= 1) {
      fillLevel.value = Math.max(0, fillLevel.value - 1); // ลดระดับเลเยอร์
      updateCupColors(); // อัปเดตสีแก้ว
    } else {
      fillLevel.value = 0;
      updateCupColors(); // รีเซ็ตสีแก้วเมื่อกลับไปหน้าคำถามแรก
    }

    clickCount.value--;
    isFinished.value = false; // ตั้งค่า isFinished เป็น false หากย้อนกลับ
  }
};

// ฟังก์ชันสำหรับส่งคำสั่งซื้อ
const submitOrder = async () => {
  try {
    const response = await addOrder(answers.value); // เรียกใช้ฟังก์ชัน addOrder ที่ดึงมาจาก fetch.js
    console.log(response.message);

    // แสดง notification เมื่อสั่งซื้อสำเร็จ
    notificationMessage.value =
      response.message || "Order submitted successfully!";
    notificationVisible.value = true;

    // รีไดเรกต์ไปยัง cart หลังจากดีเลย์สั้น ๆ
    setTimeout(() => {
      router.push({ name: "cart" });
    }, 700); // ดีเลย์ 700 มิลลิวินาทีเพื่อให้ผู้ใช้เห็น notification
  } catch (error) {
    console.error("Error submitting order:", error);

    // แสดง notification เมื่อเกิดข้อผิดพลาด
    notificationMessage.value = "Error submitting order. Please try again.";
    notificationVisible.value = true;
  }
};
</script>

<template>
  <HeaderFooterLayout>
    <template #sidebar>
      <li><a href="#" @click="router.push({ name: 'menuPage' })">Menu</a></li>
      <li><a href="#" @click="router.push({ name: 'home' })">Home</a></li>
    </template>
    <div class="wrapper h-screen bg-orange-100 justify-between">
      <div class="background" :style="{ backgroundColor: backgroundColor }">
        <div class="container">
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
      </div>

      <div
        v-if="!isFinished && currentQuestionIndex < questions.length"
        class="question-container"
      >
        <h2>{{ questions[currentQuestionIndex].question }}</h2>
        <div class="options">
          <button
            v-for="option in questions[currentQuestionIndex].options"
            :key="option.option"
            class="btn"
            @click="selectOption(option)"
          >
            {{ option.option }} - {{ option.price }} THB
          </button>
        </div>
      </div>

      <div v-else>
        <div class="flex flex-col items-center justify-center space-y-4">
          <h2 class="text-center text-lg font-bold">
            Prepared Your Custom Menu
          </h2>
          <p class="text-center">Price: {{ answers.price }} THB</p>
          <button @click="submitOrder" class="btn">Comfirm Your order</button>
        </div>
      </div>
      <div v-if="currentQuestionIndex > 0">
        <button @click="goBack" class="btn mt-3">Back</button>
      </div>
    </div>
    <Notification
      :visible="notificationVisible"
      @close="notificationVisible = false"
    >
      <template #icon>
        <span>🔔</span>
      </template>
      <template #content>
        <p>{{ notificationMessage }}</p>
      </template>
    </Notification>
  </HeaderFooterLayout>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.question-container {
  text-align: center;
  margin-bottom: 20px;
}

.options {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  background-color: #ffa12b;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.background {
  background-color: #f6bd26;
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

.cup-layer {
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: background-color 0.8s ease-in-out;
}
</style>
