<template>
  <header
    class="sidebar translate-x-[0%] transition ease-in-out delay-150"
    :class="[!collapseType ? 'translate-x-[0%]' : 'translate-x-[85%]']"
  >
    <nav class="h-screen border-r-2 border-gray-400">
      <ul v-if="!collapseType">
        <li>
          <button
            type="button"
            class="text-white text-2xl p-5 hover:text-red-600 hover:bg-gray-700"
            :class="[menutype === 'add' ? 'text-red-600 bg-gray-700' : '']"
            @click.prevent="changeMenu('add')"
          >
            <i class="bi bi-plus-circle"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            class="text-white text-2xl hover:text-red-600 hover:bg-gray-700 p-5"
            :class="[menutype === 'tasklists' ? 'text-red-600 bg-gray-700' : '']"
            @click.prevent="changeMenu('tasklists')"
          >
            <i class="bi bi-list"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            class="text-white text-2xl hover:text-red-600 hover:bg-gray-700 p-5"
            :class="[menutype === 'settings' ? 'text-red-600 bg-gray-700' : '']"
            @click.prevent="changeMenu('settings')"
          >
            <i class="bi bi-gear"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            class="text-white text-2xl hover:text-red-600 hover:bg-gray-700 p-5"
            @click.prevent="changeCollapseType"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </li>
      </ul>
      <button
        type="button"
        class="text-white text-2xl p-5 hover:text-red-600 hover:bg-gray-700"
        @click.prevent="changeCollapseType"
        v-else
      >
        <i class="bi bi-arrows"></i>
      </button>
    </nav>
    <div class="create w-full" v-if="menutype === 'add'">
      <div class="p-3">
        <h3 class="text-3xl text-white font-bold py-5">ADD NEW TASK</h3>
        <hr />
        <form class="p-2 mt-5">
          <div class="mb-4">
            <label class="block text-gray-500 text-sm font-bold mb-2" for="tasktitle">
              TASK TITLE
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tasktitle"
              type="text"
              placeholder="My Second Task"
              v-model="content"
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
              type="button"
              @click.prevent="addTodo(content)"
            >
              ADD TASK
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="tasklists w-full" v-else-if="menutype === 'tasklists'">
      <div class="p-3">
        <h3 class="text-3xl text-white font-bold py-5">TASK LISTS</h3>
        <hr />
        <ul class="flex mt-5 border-b-2">
          <li v-for="(item, index) in taskTypes" :key="index">
            <button
              type="button"
              class="sidebar-content"
              :class="[taskType === item ? 'text-white bg-red-500' : '']"
              @click.prevent="changeTaskType(item)"
            >
              {{ item }}
            </button>
          </li>
        </ul>
        <ul class="flex flex-col">
          <li
            class="flex justify-between bg-zinc-700 text-white rounded p-1 mb-1"
            v-for="item in todos"
            :key="item.id"
          >
            <div class="flex flex-col">
              <h4 class="text-white font-bold">{{ item.content }}</h4>
            </div>
            <button type="button" class="text-white text-2xl p-2 hover:text-red-600">
              <i class="bi bi-three-dots"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="settings w-full" v-else>
      <div class="p-3">
        <h3 class="text-3xl text-white font-bold py-5">Settings</h3>
        <hr />
        <div class="mb-3">
          <label for="worktime" class="block text-gray-200 text-sm font-bold mb-2">Work duration</label>
          <input type="number" id="worktime" value="0" max="60" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="timeData.worktime">
        </div>
        <div class="mb-3">
          <label for="breaktime" class="block text-gray-200 text-sm font-bold mb-2">Short break duration</label>
          <input type="number" id="breaktime" value="0" max="30" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="timeData.breaktime">
        </div>
        <div class="mb-3">
          <button type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
          @click.prevent='checkTime'>套用</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { noteStone } from '@/stores/noteStone'
import { storeToRefs } from 'pinia'
const notestone = noteStone()
const { addTodo, checkTime } = notestone
const menutype = ref('add')
const collapseType = ref('false')
const taskTypes = ref(['TODO', 'DONE'])
const taskType = ref('TODO')
const { content, todo, timeData } = storeToRefs(notestone)
const changeMenu = (type) => {
  menutype.value = type
}
const changeCollapseType = () => {
  collapseType.value = !collapseType.value
}
const changeTaskType = (type) => {
  taskType.value = type
}
const todos = computed(() => {
  let filtered = todo.value
  if (taskType.value !== 'TODO') {
    filtered = filtered.filter((item) => item.type === taskType.value)
  } else {
    filtered = filtered.filter((item) => item.type === taskType.value)
  }
  return filtered
})
</script>
