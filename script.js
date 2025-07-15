const API_URL = 'https://tarefas-herick.netlify.app/'; // Altere para a URL da sua API se necessário

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

async function fetchTasks() {
  const res = await fetch(`${API_URL}/tarefas`);
  const data = await res.json();
  renderTasks(data);
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${task.titulo}</strong><br>
      ${task.conteudo}<br><br>
      <button onclick="editTask('${task._id}', '${task.titulo.replace(/'/g, "\\'")}', '${task.conteudo.replace(/'/g, "\\'")}')">Editar</button>
      <button onclick="deleteTask('${task._id}')">Excluir</button>
    `;
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  if (title && content) {
    await fetch(`${API_URL}/tarefas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: title, conteudo: content }),
    });
    taskForm.reset();
    fetchTasks();
  }
});

async function deleteTask(id) {
  await fetch(`${API_URL}/tarefas/${id}`, { method: 'DELETE' });
  fetchTasks();
}

async function editTask(id, oldTitle, oldContent) {
  const newTitle = prompt('Novo título:', oldTitle);
  const newContent = prompt('Novo conteúdo:', oldContent);

  if (newTitle && newContent) {
    await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: newTitle, conteudo: newContent }),
    });
    fetchTasks();
  }
}

fetchTasks();
