<script setup>
import { ref, watch } from "vue";

// ตัวแปรสำหรับคำถามและตัวเลือก
const questions = ref([
  { id: 1, question: "เลือกขนาดแก้ว", options: ["Medium", "Extra"] },
  { id: 2, question: "เลือกประเภทเครื่องดื่ม", options: ["ร้อน", "เย็น"] },
  {
    id: 3,
    question: "เลือก Bottoming",
    options: ["ไข่มุกดำ", "ถั่วแดง", "คอนยัค"],
  },
  { id: 4, question: "เลือก Base", options: ["ชานม", "ชาเขียว", "โกโก้"] },
  {
    id: 5,
    question: "เลือก Flavor",
    options: ["ช็อคโกแลต", "นม", "สตอเบอร์รี่"],
  },
  {
    id: 6,
    question: "เลือก Topping",
    options: ["ไข่มุก", "เยลลี่", "วิปครีม"],
  },
]);

// เก็บคำตอบของผู้ใช้
const answers = ref([]);
const currentQuestionIndex = ref(0);
const clickCount = ref(0);

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
const maxLayers = ref(3);
let activeColors = null;
const isColorSelected = ref(false);
const scale = ref(0.7); // ขนาดเริ่มต้นเป็น Medium
const isFlavorSkipped = ref(false); // ตัวแปรบอกว่าข้ามคำถาม Flavor หรือไม่

// ฟังก์ชันเปลี่ยนขนาดแก้ว
const scaleCup = (size) => {
  if (size === "Medium") {
    if (clickCount.value === 0 || clickCount.value % 3 === 1) {
      clickCount.value += 1; // ถ้ายังไม่ได้กด Medium ก่อนหน้า บวก 1
    }
    clickCount.value += 1; // เพิ่มอีก 1 รวมเป็นบวก 2
    scale.value = 0.7;
    maxLayers.value = 3;
    isFlavorSkipped.value = true; // ข้ามคำถาม Flavor เมื่อเลือก Medium
  } else if (size === "Extra") {
    // ถ้าเลือก Extra แล้วเคยกด Medium ก่อนหน้า ให้ลบ 2 และบวก 1
    if (clickCount.value % 3 === 0 || clickCount.value % 3 === 2) {
      clickCount.value -= 2;
    }
    clickCount.value += 1; // บวก 1 เมื่อเลือก Extra
    scale.value = 1;
    maxLayers.value = 4;
    isFlavorSkipped.value = false;
  }

  fillLevel.value = Math.min(fillLevel.value, maxLayers.value);
  updateCupColors();
};

// ฟังก์ชันเปลี่ยนสีแก้ว
function changeColor(type) {
  backgroundColor.value = type === "ร้อน" ? "#fff7b7" : "#b1e0ff";
  activeColors = type === "ร้อน" ? hotColors : coldColors;
  isColorSelected.value = true;
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

// ฟังก์ชันสำหรับเลือกตัวเลือกและไปยังคำถามถัดไป
const selectOption = (option) => {
  answers.value[currentQuestionIndex.value] = option;

  // อัปเดตการเปลี่ยนแปลงตามคำถามที่เลือก
  if (currentQuestionIndex.value === 0) {
    scaleCup(option);
  } else if (currentQuestionIndex.value === 1) {
    changeColor(option);
  } else if (currentQuestionIndex.value >= 2) {
    fillLevel.value = Math.min(fillLevel.value + 1, maxLayers.value);
    updateCupColors();
  }

  // ข้ามคำถาม Flavor ถ้าเลือก Medium
  if (isFlavorSkipped.value && currentQuestionIndex.value === 4) {
    currentQuestionIndex.value += 1;
  }

  // เพิ่มจำนวนการกดปุ่ม

  clickCount.value++;
  console.log(clickCount.value);

  // ไปยังคำถามถัดไป
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
};

const goBack = () => {
  if (currentQuestionIndex.value > 0) {
    // ลบคำตอบในคำถามปัจจุบันก่อนย้อนกลับ
    answers.value.splice(currentQuestionIndex.value, 1);
    currentQuestionIndex.value--;

    // ถ้าย้อนกลับไปเจอคำถาม Flavor ให้ข้ามเมื่อเลือก Medium
    if (isFlavorSkipped.value && currentQuestionIndex.value === 4) {
      currentQuestionIndex.value--;
    }

    // ลบ layer ของแก้วตามคำถามที่ย้อนกลับ
    if (currentQuestionIndex.value >= 2) {
      fillLevel.value = Math.max(0, fillLevel.value - 1); // ลดระดับแก้ว
      updateCupColors(); // อัปเดตสีแก้วใหม่
    } else {
      // ถ้าย้อนกลับไปถึงคำถาม id1 หรือ id2 ให้รีเซ็ตแก้ว
      fillLevel.value = 0;
      updateCupColors(); // รีเซ็ตสีแก้วใหม่
    }

    // ถ้าย้อนกลับไปที่คำถาม id1 (เลือกขนาดแก้ว) ให้เปลี่ยนสีพื้นหลังเป็น '#fad168'
    if (currentQuestionIndex.value === 0) {
      backgroundColor.value = "#fad168";
    }

    // ลดจำนวนการกดปุ่ม
    clickCount.value--;
    console.log(clickCount.value);
  }
};

// Watch currentQuestionIndex และ scale เพื่อข้ามคำถาม Flavor เมื่อเลือก Medium
watch([currentQuestionIndex, scale], () => {
  // ตรวจสอบว่า currentQuestionIndex < 4 เพื่อป้องกันการข้ามแบบผิดๆ
  if (
    isFlavorSkipped.value &&
    currentQuestionIndex.value === 4 &&
    scale.value === 0.7
  ) {
    currentQuestionIndex.value += 1; // ข้ามคำถาม Flavor
  }
});
</script>

<template>
  <div class="wrapper">
    <div class="background" :style="{ backgroundColor: backgroundColor }">
      <div class="container" :style="{ transform: `scale(${scale})` }">
        <div class="cup">
          <div
            class="cup-layer"
            v-if="maxLayers === 4"
            :style="{ height: '25%', backgroundColor: cupColors.layer4 }"
          ></div>
          <div
            class="cup-layer"
            :style="{
              height: maxLayers === 4 ? '25%' : '33.33%',
              backgroundColor: cupColors.layer3,
            }"
          ></div>
          <div
            class="cup-layer"
            :style="{
              height: maxLayers === 4 ? '25%' : '33.33%',
              backgroundColor: cupColors.layer2,
            }"
          ></div>
          <div
            class="cup-layer"
            :style="{
              height: maxLayers === 4 ? '25%' : '33.33%',
              backgroundColor: cupColors.layer1,
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- ข้ามคำถาม id 5 (Flavor) ถ้าเลือกแก้ว Medium -->
    <div
      v-if="
        currentQuestionIndex < questions.length &&
        clickCount != 6 &&
        !(scale.value === 0.7 && questions[currentQuestionIndex].id === 5)
      "
      class="question-container"
    >
      <h2>{{ questions[currentQuestionIndex].question }}</h2>
      <div class="options">
        <button
          v-for="option in questions[currentQuestionIndex].options"
          :key="option"
          class="btn"
          @click="selectOption(option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div v-else>
      <h2>การตั้งค่าของคุณเสร็จสมบูรณ์แล้ว</h2>
    </div>

    <!-- ปุ่มย้อนกลับ -->
    <div v-if="currentQuestionIndex > 0">
      <button @click="goBack" class="btn">ย้อนกลับ</button>
    </div>
  </div>
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
  transition: transform 0.3s;
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
