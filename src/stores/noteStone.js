import { ref } from 'vue'
import { defineStore } from 'pinia'
import swal from 'sweetalert2'

export const noteStone = defineStore('note', () => {
  const todo = ref([])
  const content = ref('')
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
  return { todo, content, addTodo, delTodo }
})
