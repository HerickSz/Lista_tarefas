// COLE SUAS CREDENCIAIS AQUI:
const SUPABASE_URL = "https://jqxsdllyyoxrqckcerdl.supabase.co";
const SUPABASE_KEY = "sb_publishable_XgRECumJZ4lY54zN8bqMYQ__lskKK9o";

// Configuração do Supabase

// Cabeçalhos obrigatórios para todas as requisições
const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json"
};

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Buscar todas as tarefas do banco de dados
async function fetchTasks() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tarefas?select=*`, {
      method: "GET",
      headers: headers
    });

    const data = await res.json();
    renderTasks(data);
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err);
  }
}

// Exibir tarefas no HTML
function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.titulo}</strong><br>${task.conteudo}<br><br>
      <button onclick="editTask(${task.id}, '${task.titulo.replace(/'/g, "\\'")}', '${task.conteudo.replace(/'/g, "\\'")}')">Editar</button>
      <button onclick="deleteTask(${task.id})">Excluir</button>
    `;
    taskList.appendChild(li);
  });
}

// Adicionar nova tarefa
taskForm.onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (title && content) {
    await fetch(`${SUPABASE_URL}/rest/v1/tarefas`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ titulo: title, conteudo: content })
    });

    taskForm.reset();
    fetchTasks();
  }
};

// Excluir tarefa pelo ID
async function deleteTask(id) {
  await fetch(`${SUPABASE_URL}/rest/v1/tarefas?id=eq.${id}`, {
    method: "DELETE",
    headers: headers
  });
  fetchTasks();
}

// Editar tarefa com novo título e conteúdo
async function editTask(id, oldTitle, oldContent) {
  const newTitle = prompt("Novo título:", oldTitle);
  const newContent = prompt("Novo conteúdo:", oldContent);

  if (newTitle && newContent) {
    await fetch(`${SUPABASE_URL}/rest/v1/tarefas?id=eq.${id}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({ titulo: newTitle, conteudo: newContent })
    });

    fetchTasks();
  }
}

// Buscar tarefas ao carregar a página
fetchTasks();

