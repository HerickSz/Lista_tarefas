// COLE SUAS CREDENCIAIS AQUI:
const SUPABASE_URL = "https://jqxsdllyyoxrqckcerdl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHNkbGx5eW94cnFja2NlcmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzE1NTgsImV4cCI6MjA2ODEwNzU1OH0.CsFA1IIMWPge8mYPyfuA539jZZy-cMaofw0oKKsYYzI";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json"
};

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

async function fetchTasks() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/tarefas?select=*`, { headers });
  const data = await res.json();
  renderTasks(data);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.titulo}</strong><br>${task.conteudo}<br><br>
      <button onclick="editTask(${task.id}, '${task.titulo}', '${task.conteudo.replace(/'/g, "\\'")}')">Editar</button>
      <button onclick="deleteTask(${task.id})">Excluir</button>
    `;
    taskList.appendChild(li);
  });
}

taskForm.onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (title && content) {
    await fetch(`${SUPABASE_URL}/rest/v1/tarefas`, {
      method: "POST",
      headers,
      body: JSON.stringify({ titulo: title, conteudo: content })
    });

    taskForm.reset();
    fetchTasks();
  }
};

async function deleteTask(id) {
  await fetch(`${SUPABASE_URL}/rest/v1/tarefas?id=eq.${id}`, {
    method: "DELETE",
    headers
  });
  fetchTasks();
}

async function editTask(id, oldTitle, oldContent) {
  const newTitle = prompt("Novo título:", oldTitle);
  const newContent = prompt("Novo conteúdo:", oldContent);
  if (newTitle && newContent) {
    await fetch(`${SUPABASE_URL}/rest/v1/tarefas?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ titulo: newTitle, conteudo: newContent })
    });
    fetchTasks();
  }
}

// Carregar as tarefas ao abrir o site
fetchTasks();
