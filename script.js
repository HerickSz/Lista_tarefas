const API_URL = 'https://lista-tarefas-sdvo.onrender.com';

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editTitle = document.getElementById('editTitle');
const editContent = document.getElementById('editContent');

let currentEditId = null;

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
  <strong>${task.titulo}</strong>
  <p>${task.conteudo}</p>
  <div class="task-actions">
    <button class="edit" onclick="openEditModal('${task._id}', '${task.titulo.replace(/'/g, "\\'")}', '${task.conteudo.replace(/'/g, "\\'")}')">Editar</button>
    <button class="delete" onclick="deleteTask('${task._id}')">Excluir</button>
  </div>
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
  if (!confirm('Deseja realmente excluir esta tarefa?')) return;

  await fetch(`${API_URL}/tarefas/${id}`, { method: 'DELETE' });
  fetchTasks();
}

function openEditModal(id, title, content) {
  currentEditId = id;
  editTitle.value = title;
  editContent.value = content;
  editModal.classList.remove('hidden');
}

function closeModal() {
  editModal.classList.add('hidden');
  currentEditId = null;
}

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  await fetch(`${API_URL}/tarefas/${currentEditId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: editTitle.value.trim(),
      conteudo: editContent.value.trim()
    }),
  });

  closeModal();
  fetchTasks();
});

// Fecha modal ao clicar no X
document.querySelector('.close-btn').addEventListener('click', closeModal);

fetchTasks();
