// FocusVerse App - Modular Implementation
const FocusVerse = (() => {
  // Initialize all modules
  const init = () => {
    TimerModule.init();
    JournalModule.init();
    TodoModule.init();
    ResourceModule.init();
    DarkModeModule.init();
  };

  return { init };
})();

// Timer Module
const TimerModule = (() => {
  let timer;
  let timeLeft = 1500; // 25 minutes in seconds
  let isRunning = false;
  const timerElement = document.getElementById('timer');
  const startBtn = document.getElementById('start-timer');
  const pauseBtn = document.getElementById('pause-timer');
  const resetBtn = document.getElementById('reset-timer');

  function updateDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    timerElement.textContent = `${minutes}:${seconds}`;
  }

  function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        isRunning = false;
        alert("Time's up! Take a 5-minute break.");
        // Play notification sound could be added here
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
  }

  function resetTimer() {
    pauseTimer();
    timeLeft = 1500;
    updateDisplay();
  }

  function init() {
    updateDisplay();
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
  }

  return { init };
})();

// Journal Module
const JournalModule = (() => {
  const journalInput = document.getElementById('journal');
  const notesList = document.getElementById('notes');
  const saveBtn = document.getElementById('save-note');

  function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('focusNotes')) || [];
    notesList.innerHTML = savedNotes.map(note => `
      <li>
        <div>
          <span>${note.text}</span>
          <small class="timestamp">${new Date(note.timestamp).toLocaleString()}</small>
        </div>
        <button class="delete-btn" data-id="${note.id}">×</button>
      </li>
    `).join('');
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', deleteNote);
    });
  }

  function saveNote() {
    const noteText = journalInput.value.trim();
    if (!noteText) return;

    const savedNotes = JSON.parse(localStorage.getItem('focusNotes')) || [];
    const newNote = {
      id: Date.now(),
      text: noteText,
      timestamp: new Date().toISOString()
    };
    
    savedNotes.push(newNote);
    localStorage.setItem('focusNotes', JSON.stringify(savedNotes));
    journalInput.value = "";
    loadNotes();
  }

  function deleteNote(e) {
    const noteId = Number(e.target.dataset.id);
    const savedNotes = JSON.parse(localStorage.getItem('focusNotes')) || [];
    const updatedNotes = savedNotes.filter(note => note.id !== noteId);
    
    localStorage.setItem('focusNotes', JSON.stringify(updatedNotes));
    loadNotes();
  }

  function init() {
    loadNotes();
    saveBtn.addEventListener('click', saveNote);
    // Save on Enter key (but allow Shift+Enter for new lines)
    journalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        saveNote();
      }
    });
  }

  return { init };
})();

// To-Do Module
const TodoModule = (() => {
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const addBtn = document.getElementById('add-todo');

  function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem('focusTodos')) || [];
    todoList.innerHTML = savedTodos.map(todo => `
      <li>
        <div>
          <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
          <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
        </div>
        <button class="delete-btn" data-id="${todo.id}">×</button>
      </li>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', deleteTodo);
    });
    
    document.querySelectorAll('#todo-list input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', toggleTodoComplete);
    });
  }

  function addTodo() {
    const todoText = todoInput.value.trim();
    if (!todoText) return;

    const savedTodos = JSON.parse(localStorage.getItem('focusTodos')) || [];
    const newTodo = {
      id: Date.now(),
      text: todoText,
      completed: false
    };
    
    savedTodos.push(newTodo);
    localStorage.setItem('focusTodos', JSON.stringify(savedTodos));
    todoInput.value = "";
    loadTodos();
  }

  function deleteTodo(e) {
    const todoId = Number(e.target.dataset.id);
    const savedTodos = JSON.parse(localStorage.getItem('focusTodos')) || [];
    const updatedTodos = savedTodos.filter(todo => todo.id !== todoId);
    
    localStorage.setItem('focusTodos', JSON.stringify(updatedTodos));
    loadTodos();
  }

  function toggleTodoComplete(e) {
    const todoId = Number(e.target.dataset.id);
    const savedTodos = JSON.parse(localStorage.getItem('focusTodos')) || [];
    const updatedTodos = savedTodos.map(todo => 
      todo.id === todoId ? {...todo, completed: !todo.completed} : todo
    );
    
    localStorage.setItem('focusTodos', JSON.stringify(updatedTodos));
    loadTodos();
  }

  function init() {
    loadTodos();
    addBtn.addEventListener('click', addTodo);
    // Add on Enter key
    todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addTodo();
      }
    });
  }

  return { init };
})();


const toggleBtn = document.getElementById('dark-toggle');
let isDark = localStorage.getItem('focusTheme') === 'dark';

function applyTheme() {
  document.body.classList.toggle('dark-mode', isDark);
  toggleBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('focusTheme', isDark ? 'dark' : 'light');
}

toggleBtn.addEventListener('click', () => {
  isDark = !isDark;
  applyTheme();
});

applyTheme(); // Run once on page load

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', FocusVerse.init);