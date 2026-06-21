/**
 * TaskFlow IA - Gestor de Tareas de Equipo
 * Lógica de negocio y renderizado reactivo sin dependencias pesadas.
 * Almacenamiento persistente en localStorage.
 * 
 * Desarrollado por un Desarrollador Frontend Senior.
 */

// --- CONFIGURACIÓN DE TAREAS SEMILLA (SEED DATA) ---
const INITIAL_TASKS = [
  {
    title: "Configurar Entorno de Google AI Studio",
    desc: "Vincular las credenciales de desarrollo y probar la respuesta del agente con Gemini. ¡Listo para producción!",
    priority: "high",
    status: "completed",
    createdAt: new Date().toISOString()
  },
  {
    title: "Implementar Dashboard de Estadísticas",
    desc: "Calcular métricas en tiempo real: tareas pendientes, en progreso y completadas de manera interactiva.",
    priority: "medium",
    status: "in_progress",
    createdAt: new Date().toISOString()
  },
  {
    title: "Redactar Guía de Despliegue en Vercel",
    desc: "Añadir la documentación del proyecto detallando el paso a paso en el archivo README.md.",
    priority: "low",
    status: "pending",
    createdAt: new Date().toISOString()
  }
];

// Instancia del estado global
let tasks = [];

// --- MANEJO DEL DOM ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTasks();
  setupEventListeners();
  renderApp();
});

// --- TEMA CLARO / OSCURO (THEME CONTROL) ---
function initTheme() {
  const savedTheme = localStorage.getItem("taskflow-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  updateThemeToggleIcons();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("taskflow-theme", isDark ? "dark" : "light");
  updateThemeToggleIcons();
  showToast(isDark ? "Modo oscuro activado 🌙" : "Modo claro activado ☀️");
}

function updateThemeToggleIcons() {
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");
  const isDark = document.documentElement.classList.contains("dark");

  if (isDark) {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }
}

// --- PERSISTENCIA Y INICIALIZACIÓN DE TAREAS ---
function initTasks() {
  const localTasks = localStorage.getItem("taskflow-tasks");
  if (localTasks) {
    try {
      tasks = JSON.parse(localTasks);
    } catch (e) {
      console.error("Error al parsear tareas de localStorage. Recargando semilla.", e);
      tasks = [...INITIAL_TASKS];
      saveTasksToStorage();
    }
  } else {
    // Primera carga: Usar tareas semilla
    tasks = [...INITIAL_TASKS];
    saveTasksToStorage();
  }
}

function saveTasksToStorage() {
  localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

// --- REGISTRO DE EVENTOS (EVENT LISTENERS) ---
function setupEventListeners() {
  // Toggle del tema
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  // Apertura de modal de nueva tarea
  document.getElementById("btnNewTask").addEventListener("click", () => openModal());
  document.getElementById("btnEmptyCreate").addEventListener("click", () => openModal());

  // Cierre de modal
  document.getElementById("btnModalClose").addEventListener("click", closeModal);
  document.getElementById("btnModalCancel").addEventListener("click", closeModal);
  
  // Guardar formulario de tarea
  document.getElementById("taskForm").addEventListener("submit", handleFormSubmit);

  // Filtros reactivos instantáneos
  document.getElementById("searchInput").addEventListener("input", renderApp);
  
  const filterStatus = document.getElementById("filterStatus");
  const filterStatusMobile = document.getElementById("filterStatusMobile");
  if (filterStatus) {
    filterStatus.addEventListener("change", () => {
      if (filterStatusMobile) filterStatusMobile.value = filterStatus.value;
      renderApp();
    });
  }
  if (filterStatusMobile) {
    filterStatusMobile.addEventListener("change", () => {
      if (filterStatus) filterStatus.value = filterStatusMobile.value;
      renderApp();
    });
  }

  const filterPriority = document.getElementById("filterPriority");
  const filterPriorityMobile = document.getElementById("filterPriorityMobile");
  if (filterPriority) {
    filterPriority.addEventListener("change", () => {
      if (filterPriorityMobile) filterPriorityMobile.value = filterPriority.value;
      renderApp();
    });
  }
  if (filterPriorityMobile) {
    filterPriorityMobile.addEventListener("change", () => {
      if (filterPriority) filterPriority.value = filterPriorityMobile.value;
      renderApp();
    });
  }

  // Cerrar modal al hacer click fuera del contenedor principal del dialogo
  const modal = document.getElementById("taskModal");
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// --- RENDERIZADO PRINCIPAL (REACTIVE RENDERING ENGINE) ---
function renderApp() {
  const searchVal = document.getElementById("searchInput").value.toLowerCase().trim();
  const statusFilter = document.getElementById("filterStatus").value;
  const priorityFilter = document.getElementById("filterPriority").value;

  // Filtrar tareas según las preferencias
  const filteredTasks = tasks.map((task, originalIndex) => ({ ...task, originalIndex }))
    .filter(item => {
      // Filtro de Texto (Título o descripción)
      const matchesSearch = item.title.toLowerCase().includes(searchVal) || 
                            item.desc.toLowerCase().includes(searchVal);
      
      // Filtro de Estado
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      // Filtro de Prioridad
      const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

  // Renderizar Grid de Tarjetas
  renderTasksGrid(filteredTasks);

  // Actualizar estadísticas del Dashboard
  updateDashboardStats();
}

function renderTasksGrid(filteredTasks) {
  const cardsGrid = document.getElementById("tasksGrid");
  const emptyState = document.getElementById("emptyState");

  if (filteredTasks.length === 0) {
    cardsGrid.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  cardsGrid.classList.remove("hidden");
  emptyState.classList.add("hidden");

  // Vaciar contenido previo
  cardsGrid.innerHTML = "";

  // Insertar cada tarjeta de tarea
  filteredTasks.forEach(task => {
    const card = createTaskCardHTML(task);
    cardsGrid.appendChild(card);
  });
}

function createTaskCardHTML(task) {
  const { title, desc, priority, status, originalIndex } = task;
  
  // Traducir prioridades a textos legibles y clases visuales
  let priorityLabel = "Baja";
  let priorityClass = "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40";
  if (priority === "high") {
    priorityLabel = "Alta";
    priorityClass = "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40";
  } else if (priority === "medium") {
    priorityLabel = "Media";
    priorityClass = "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40";
  }

  // Clases visuales según el estado
  let statusColorClass = "border-amber-300 dark:border-amber-800/80";
  let statusBg = "bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950";
  let statusText = "Pendiente 💤";
  let nextActionText = "Comenzar ⚡";
  let nextActionColor = "text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800";

  if (status === "in_progress") {
    statusColorClass = "border-blue-400 dark:border-blue-800/80";
    statusText = "En Progreso ⚡";
    nextActionText = "Completar 🎉";
  } else if (status === "completed") {
    statusColorClass = "border-emerald-400 dark:border-emerald-800/80";
    statusBg = "bg-emerald-50/20 dark:bg-emerald-950/10 dark:from-slate-900 dark:to-slate-950/80";
    statusText = "Completada 🎉";
    nextActionText = "Reiniciar 💤";
  }

  // Crear elemento del DOM de forma segura
  const cardDiv = document.createElement("div");
  // ID exclusivo para cada tarjeta para cumplir directiva HTML ID Attribute Guidelines
  cardDiv.id = `task-card-${originalIndex}`;
  cardDiv.className = `flex flex-col rounded-2xl border-2 ${statusColorClass} ${statusBg} p-5 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in relative group`;

  // Prevenir inyección de HTML con escape de variables
  const safeTitle = escapeHTML(title);
  const safeDesc = escapeHTML(desc || "Sin descripción proporcionada.");

  cardDiv.innerHTML = `
    <!-- Header de la tarjeta -->
    <div class="flex justify-between items-start gap-4 mb-3">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${priorityClass}">
        ${priorityLabel}
      </span>
      
      <!-- Menú de Acciones Rápidas -->
      <div class="flex items-center space-x-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <!-- Edit Button -->
        <button onclick="editTask(${originalIndex})" class="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition duration-150" title="Editar tarea">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <!-- Delete Button -->
        <button onclick="deleteTask(${originalIndex})" class="p-1.5 rounded-lg text-rose-500/80 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition duration-150" title="Eliminar tarea">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Título y Descripción -->
    <div class="flex-grow">
      <h4 class="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug tracking-tight">
        ${safeTitle}
      </h4>
      <p class="text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed line-clamp-3">
        ${safeDesc}
      </p>
    </div>

    <!-- Separador -->
    <div class="my-4 border-t border-slate-100 dark:border-slate-800"></div>

    <!-- Footer de la tarjeta con control de estado dinámico -->
    <div class="flex items-center justify-between gap-2 mt-auto">
      <div>
        <span class="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">Estado</span>
        <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">
          ${statusText}
        </span>
      </div>

      <!-- Quick Action: Cycle Status Button -->
      <button onclick="cycleTaskStatus(${originalIndex})" class="inline-flex items-center space-x-1 py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95 transition-all duration-150">
        <span>${nextActionText}</span>
        <svg class="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  `;

  return cardDiv;
}

// --- ACTUALIZACIÓND DE ESTADÍSTICAS DEL DASHBOARD ---
function updateDashboardStats() {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const completed = tasks.filter(t => t.status === "completed").length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statPending").textContent = pending;
  document.getElementById("statInProgress").textContent = inProgress;
  document.getElementById("statCompleted").textContent = completed;
}

// --- CONTROL DEL MODAL (OPENS AND CLOSES) ---
function openModal(editingIndex = "") {
  const modal = document.getElementById("taskModal");
  const modalTitle = document.getElementById("modalTitle");
  const taskIndexInput = document.getElementById("taskIndex");
  const form = document.getElementById("taskForm");
  
  form.reset();

  if (editingIndex !== "") {
    // Modo Edición
    const task = tasks[editingIndex];
    modalTitle.textContent = "Editar Tarea ✏️";
    taskIndexInput.value = editingIndex;
    
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDesc").value = task.desc;
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("taskStatus").value = task.status;
  } else {
    // Modo Nuevo
    modalTitle.textContent = "Nueva Tarea ✨";
    taskIndexInput.value = "";
  }

  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden"); // Evita el scroll trasero
}

function closeModal() {
  const modal = document.getElementById("taskModal");
  modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

// --- GESTIÓN DE ENVÍO DE FORMULARIO (SUBMIT CONTROL) ---
function handleFormSubmit(e) {
  e.preventDefault();

  const indexVal = document.getElementById("taskIndex").value;
  const title = document.getElementById("taskTitle").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const status = document.getElementById("taskStatus").value;

  if (!title) {
    showToast("Por favor ingresa un título para la tarea. ⚠️");
    return;
  }

  if (indexVal !== "") {
    // Editar tarea existente
    const idx = parseInt(indexVal, 10);
    tasks[idx] = {
      ...tasks[idx],
      title,
      desc,
      priority,
      status
    };
    showToast("¡Tarea actualizada con éxito! ⚡");
  } else {
    // Agregar nueva tarea
    const newTask = {
      title,
      desc,
      priority,
      status,
      createdAt: new Date().toISOString()
    };
    tasks.unshift(newTask); // Inserta al principio de la lista
    showToast("¡Nueva tarea creada con éxito! 🎉");
  }

  saveTasksToStorage();
  closeModal();
  renderApp();
}

// --- ELIMINAR TAREA ---
window.deleteTask = function(index) {
  const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta tarea permanentemente?");
  if (confirmDelete) {
    tasks.splice(index, 1);
    saveTasksToStorage();
    renderApp();
    showToast("Tarea eliminada correctamente 🗑️");
  }
};

// --- EDITAR TAREA ---
window.editTask = function(index) {
  openModal(index);
};

// --- AVANCE RÁPIDO DE ESTADO (CYCLE STATUS CHANGER) ---
window.cycleTaskStatus = function(index) {
  const task = tasks[index];
  let nextStatus = "pending";
  let statusEmojiName = "Pendiente 💤";

  if (task.status === "pending") {
    nextStatus = "in_progress";
    statusEmojiName = "En Progreso ⚡";
  } else if (task.status === "in_progress") {
    nextStatus = "completed";
    statusEmojiName = "Completada 🎉";
  } else {
    nextStatus = "pending";
    statusEmojiName = "Pendiente 💤";
  }

  tasks[index].status = nextStatus;
  saveTasksToStorage();
  renderApp();
  showToast(`Estado cambiado a: ${statusEmojiName}`);
};

// --- MENSAJES TOAST (MICRO-INTERACTIONS) ---
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  
  toastMsg.textContent = message;
  
  // Limpiar timers pendientes
  clearTimeout(toastTimeout);
  
  // Animación de entrada
  toast.classList.remove("translate-y-24", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");
  
  // Temporizador para esconderlo
  toastTimeout = setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-24", "opacity-0");
  }, 3500);
}

// --- SEGURIDAD CONTRA INYECCIONES (ESCAPILLO HTML) ---
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
