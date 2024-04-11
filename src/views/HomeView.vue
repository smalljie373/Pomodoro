<template>
  <div class="h-screen flex flex-row-reverse overflow-hidden">
    <NavBar></NavBar>
    <div
      class="w-full bg-gray-200 flex justify-center"
      :class="[restMode ? 'bg-green-200' : 'bg-gray-200']"
    >
      <div class="flex flex-col justify-around h-full">
        <h2 class="text-3xl text-center font-bold" v-if="todos.length != 0">
          {{ todos[0]?.content }}
        </h2>
        <h2 class="text-3xl text-center font-bold" v-else>還未新增番茄鐘</h2>
        <div class="card-content-image relative">
          <canvas id="heroChart" ref="heroChart"></canvas>
          <h2 class="font-bold text-4xl absolute top-[135px] left-[105px]">
            {{ miunte.toString().length === 1 ? '0' + miunte : miunte }}:{{
              second.toString().length === 1 ? '0' + second : second
            }}
          </h2>
        </div>
        <div class="controlpanel">
          <ul class="flex justify-between items-center">
            <li>
              <button
                type="button"
                class="text-white bg-gray-600 rounded-full text-3xl p-3 shadow-xl hover:text-red-600"
                @click.prevent="startTime"
                :disabled="timingType === 'play' || todo.length === 0"
              >
                <i class="bi bi-play-circle"></i>
              </button>
            </li>
            <li>
              <button
                type="button"
                class="text-white bg-gray-600 rounded-full text-3xl p-3 shadow-xl hover:text-red-600"
                @click.prevent="pauseTime"
                :disabled="timingType === 'pause' || todo.length === 0"
              >
                <i class="bi bi-stop-circle"></i>
              </button>
            </li>
            <li>
              <button
                type="button"
                class="text-white bg-gray-600 rounded-full text-3xl p-3 shadow-xl hover:text-red-600"
                @click.prevent="resetTime"
                :disabled="timingType === 'reset' || todo.length === 0"
              >
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </li>
          </ul>
        </div>
        <h4 class="text-xl text-center font-bold">TASK COMPLETE</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import { noteStone } from '@/stores/noteStone'
import { storeToRefs } from 'pinia'
const notestone = noteStone()
const { todo } = storeToRefs(notestone)
const { delTodo } = notestone
const time = ref(15) // 總秒數
const miunte = ref(0) // 分鐘
const second = ref(15) // 秒數
const countTime = ref({}) // 存放計時器
const timingType = ref('') //
const heroChart = ref(null)
const restMode = ref(false)
let myChart // 存放chart.js的圓餅圖
onMounted(() => {
  myChart = new Chart(heroChart.value, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          label: 'Dataset 1',
          data: [0, 1500],
          backgroundColor: ['#EA5548', '#ACACAC']
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      }
    }
  })
})

watch(time, (newValue) => {
  // 監聽計時器變化
  if (myChart) {
    myChart.data.datasets[0].data[0] += 1
    myChart.data.datasets[0].data[1] = newValue
    myChart.update()
  }
})
const getTime = () => {
  //啟動計時器
  if (time.value <= 0) {
    restMode.value = !restMode.value
    resetTime()
    delTodo(todos.value[0]?.id)
  }
  time.value = time.value - 1
  miunte.value = Math.floor(time.value / 60) % 60 || 0
  let delta = time.value
  second.value = delta % 60 || 0
}
const startTime = () => {
  // 開始計時
  timingType.value = 'play'
  countTime.value = window.setInterval(getTime, 1000)
}
const pauseTime = () => {
  // 暫停計時
  timingType.value = 'pause'
  window.clearInterval(countTime.value)
  countTime.value = {}
}
const resetTime = () => {
  // 重置計時
  timingType.value = 'reset'
  window.clearInterval(countTime.value)
  if (restMode.value) {
    setTimeout(() => {
      countTime.value = {}
      time.value = 300
      miunte.value = 5
      second.value = 0
      myChart.data.datasets[0].data[0] = 0
      myChart.data.datasets[0].data[1] = 300
      myChart.update()
    }, 0)
  } else {
    setTimeout(() => {
      countTime.value = {}
      time.value = 1500
      miunte.value = 25
      second.value = 0
      myChart.data.datasets[0].data[0] = 0
      myChart.data.datasets[0].data[1] = 1500
      myChart.update()
    }, 0)
  }
}
const todos = computed(() => {
  let filtered = todo.value
  filtered = filtered.filter((item) => item.type === 'TODO')

  return filtered
})
</script>
