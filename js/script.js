// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Tasks array to store all tasks
let tasks = [];

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task when button is clicked
addTaskBtn.addEventListener('click', addTask);

// Add task when Enter key is pressed
taskInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  
  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }
  
  // Create task object
  const task = {
    id: Date.now(), // Unique ID based on timestamp
    text: taskText,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  // Add task to array
  tasks.push(task);
  
  // Clear input
  taskInput.value = '';
  
  // Save to localStorage
  saveTasks();
  
  // Render tasks
  renderTasks();
  
  // Focus back to input
  taskInput.focus();
}

// Function to render all tasks
function renderTasks() {
  // Clear current list
  taskList.innerHTML = '';
  
  if (tasks.length === 0) {
    // Show empty state
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No tasks yet. Add your first task above!';
    taskList.appendChild(emptyState);
    return;
  }
  
  // Create and append each task
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.dataset.id = task.id;
    
    taskItem.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
      </div>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    
    taskList.appendChild(taskItem);
    
    // Add event listeners for this task
    const checkbox = taskItem.querySelector('.task-checkbox');
    const editBtn = taskItem.querySelector('.edit-btn');
    const deleteBtn = taskItem.querySelector('.delete-btn');
    const taskText = taskItem.querySelector('.task-text');
    
    // Toggle completion
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      taskText.classList.toggle('completed', task.completed);
      saveTasks();
      updateTaskCount();
    });
    
    // Edit task
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit your task:', task.text);
      if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        taskText.textContent = task.text;
        taskText.classList.toggle('completed', task.completed);
        saveTasks();
      }
    });
    
    // Delete task
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== task.id);
        taskItem.remove();
        saveTasks();
        renderTasks();
      }
    });
  });
  
  // Update task count
  updateTaskCount();
}

// Function to update task count display
function updateTaskCount() {
  // Remove existing count if present
  const existingCount = document.querySelector('.task-count');
  if (existingCount) {
    existingCount.remove();
  }
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  
  const taskCount = document.createElement('div');
  taskCount.className = 'task-count';
  taskCount.textContent = `Tasks: ${completedTasks} completed out of ${totalTasks} total`;
  
  taskList.appendChild(taskCount);
}

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem('todo-tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem('todo-tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

// Function to escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Optional: Clear all tasks button (uncomment if needed)
/*
function addClearAllButton() {
  const clearAllBtn = document.createElement('button');
  clearAllBtn.id = 'clearAllBtn';
  clearAllBtn.textContent = 'Clear All Tasks';
  clearAllBtn.style.cssText = `
    width: 100%;
    padding: 15px;
    margin-top: 20px;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
  `;
  
  clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete ALL tasks?')) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });
  
  document.querySelector('.container').appendChild(clearAllBtn);
}

// Call this function if you want to add a clear all button
addClearAllButton();
*/
