import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
  const setUser = data => {
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  return { user, setUser }
})
