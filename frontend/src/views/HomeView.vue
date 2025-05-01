<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
const tasksStore = useTasksStore()
onMounted(() => {
  tasksStore.indexTodos()
})
const newTask = ref('')
const isInvalid = computed(() => {
  return newTask.value.trim() === ''
})
const editingTaskId = ref(null)
const editedTitle = ref('')

const confirmationVisible = ref(false)
const taskToDelete = ref(null)
// Pagination variables
const currentPage = ref(1)
const tasksPerPage = 5

const totalPages = computed(() => Math.ceil(tasksStore.tasks.length / tasksPerPage))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * tasksPerPage
  const end = start + tasksPerPage
  return tasksStore.tasks.slice(start, end)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = currentPage.value

  // if reaching near the end
  if (start + maxVisible - 1 > totalPages.value) {
    start = Math.max(totalPages.value - maxVisible + 1, 1)
  }

  for (let i = start; i < start + maxVisible && i <= totalPages.value; i++) {
    pages.push(i)
  }

  return pages
})

function addNew() {
  tasksStore.addTask(newTask.value)
  newTask.value = ''
}
// show input for editing a task
function showEdit(task) {
  editedTitle.value = task.title
  editingTaskId.value = task.id
}

// Edit task title
function saveEdit(task) {
  if (editedTitle.value.trim() !== '') {
    task.title = editedTitle.value
    tasksStore.updateTask(task)
  }
  editingTaskId.value = null
}

// edit task status
function updateStatus(task) {
  task.status = !task.status
  tasksStore.updateTask(task)
}
function confirmDelete(task) {
  taskToDelete.value = task
  confirmationVisible.value = true
}

function deleteTask() {
  if (taskToDelete.value) {
    tasksStore.deleteTask(taskToDelete.value)
    if (paginatedTasks.value.length === 1 && currentPage !== 1) {
      currentPage.value = currentPage.value - 1
    }
    confirmationVisible.value = false
  }
}

function cancelDelete() {
  confirmationVisible.value = false
}
</script>

<template>
  <div class="container my-5">
    <div class="card shadow">
      <div class="card-body">
        <h1 class="card-title text-center mb-4">Todo List</h1>

        <form class="d-flex mb-4" @submit.prevent="addNew">
          <input
            v-model="newTask"
            type="text"
            class="form-control me-2"
            placeholder="Add a new task"
          />
          <button :disabled="isInvalid" type="submit" class="btn btn-primary">Add</button>
        </form>

        <ul class="list-group">
          <li
            v-for="task in paginatedTasks"
            :key="task.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <span
              v-if="editingTaskId !== task.id"
              @click="showEdit(task)"
              :class="task.status ? 'text-decoration-line-through fw-bold' : 'text-muted'"
              style="cursor: pointer"
            >
              {{ task.title }}
            </span>

            <input
              v-else
              autofocus
              v-model="editedTitle"
              @blur="saveEdit(task)"
              @keyup.enter="saveEdit(task)"
              type="text"
              class="form-control form-control-sm"
              style="max-width: 300px"
            />
            <div>
              <button @click="updateStatus(task)" class="btn btn-sm btn-primary">
                {{ task.status ? 'Uncheck' : 'Check' }}
              </button>
              <button @click="confirmDelete(task)" class="btn btn-sm btn-danger">Delete</button>
            </div>
          </li>
        </ul>
        <!-- Custom Confirmation Modal -->
        <div
          v-if="confirmationVisible"
          class="modal fade show d-block"
          tabindex="-1"
          style="display: block; background-color: rgba(0, 0, 0, 0.5)"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Confirm Deletion</h5>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete this task?</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="deleteTask">
                  Yes, Delete
                </button>
                <button type="button" class="btn btn-secondary" @click="cancelDelete">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Pagination controls -->
        <div
          v-if="tasksStore.tasks.length > tasksPerPage"
          class="d-flex justify-content-center mt-4"
        >
          <button
            class="btn btn-outline-primary me-2"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            class="btn"
            :class="page === currentPage ? 'btn-primary' : 'btn-outline-primary'"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            class="btn btn-outline-primary ms-2"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}
button {
  margin-left: 10px;
}
</style>
