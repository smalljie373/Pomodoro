import { ref } from 'vue'
import { defineStore } from 'pinia'
import swal from 'sweetalert2'

export const noteStone = defineStore('note', () => {
  const todo = ref([])
  const content = ref('')
  const time = ref(1500);
  const miunte = ref(25);
  const second = ref(0);
  const timeType = ref('work');
  const timeData = ref({
    worktime: 25,
    breaktime: 5,
  })
  const renderString = () => {
    const length = 8
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters[randomIndex]
    }
    return result
  }
  const addTodo = (value) => {
    swal
      .fire({
        icon: 'warning',
        title: '確定新增此番茄鐘?',
        text: value,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          swal.fire({
            title: '新增完畢',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          setTimeout(() => {
            const note = {
              id: renderString(),
              content: value,
              type: 'TODO'
            }
            todo.value.push(note)
            content.value = ''
          }, 1000)
        }
      })
  }
  const delTodo = (id) => {
    const Data = todo.value.map((item) => {
      if (item.id === id) {
        return { ...item, type: 'DONE' }
      } else {
        return item
      }
    })
    todo.value = Data
  }
  const checkTime = () => {
    if(timeType.value === 'work') {
      miunte.value  = timeData.value.worktime;
      second.value = 0;
      time.value = miunte.value*60 + second.value;
    } else{
      miunte.value  = timeData.value.breaktime;
      second.value = 0;
      time.value = miunte.value*60 + second.value;
    }
  }
  const checkTimeType = (type) => {
    timeType.value = type;
  }
  return { todo, content, timeData, addTodo, delTodo,checkTimeType, checkTime, time, miunte, second,timeType }
})
