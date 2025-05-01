import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks-store', {
  state() {
    return {
      tasks: [],
    }
  },
  actions: {
    // get all the tasks
    async indexTodos() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tasks', {
          method: 'GET',
        })
        const data = await response.json()
        this.tasks = data
      } catch (error) {
        console.error(error)
      }
    },

    // add a new task
    async addTask(newTask) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tasks', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ title: newTask }),
        })
        const data = await response.json()
        this.tasks.unshift(data)
      } catch (error) {
        console.error('Error caught:', error)
        throw error
      }
    },

    // update the task
    async updateTask(task) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(task),
        })
        const data = await response.json()
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    // delete a task
    async deleteTask(task) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        const data = await response.json()
        if (data.message) {
          this.tasks = this.tasks.filter((t) => t.id !== task.id)
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    },
  },
})
