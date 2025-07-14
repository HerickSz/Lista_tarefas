// Supondo que as variáveis de ambiente foram injetadas no build, 
// ou definidas em um arquivo config.js, por exemplo:
const SUPABASE_URL = window.SUPABASE_URL || "https://jqxsdllyyoxrqckcerdl.supabase.co";
const SUPABASE_KEY = window.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHNkbGx5eW94cnFja2NlcmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzE1NTgsImV4cCI6MjA2ODEwNzU1OH0.CsFA1IIMWPge8mYPyfuA539jZZy-cMaofw0oKKsYYzI";

// Importar o cliente Supabase via CDN (adicione no HTML):
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js"></script>

// Criar instância do cliente Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Buscar todas as tarefas do banco de dados
async function fetchTasks() {
  try {
    const { data, error } = await supabase.from('tarefas').select('*');
    if (error) throw error;
    renderTasks(data);
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err);
  }
}

// Exibir tarefas no HTML
function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const titulo = task.titulo || "";
    const conteudo = task.conteudo || "";
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${titulo}</strong><br>${conteudo}<br><br>
      <button onclick="editTask(${task.id}, '${titulo.replace(/'/g, "\\'")}', '${conteudo.replace(/'/g, "\\'")}')">Editar</button>
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
    try {
      const { error } = await supabase.from('tarefas').insert([{ titulo: title, conteudo: content }]);
      if (error) throw error;
      taskForm.reset();
      fetchTasks();
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
    }
  }
};

// Excluir tarefa pelo ID
async function deleteTask(id) {
  try {
    const { error } = await supabase.from('tarefas').delete().eq('id', id);
    if (error) throw error;
    fetchTasks();
  } catch (err) {
    console.error("Erro ao excluir tarefa:", err);
  }
}

// Editar tarefa com novo título e conteúdo
async function editTask(id, oldTitle, oldContent) {
  const newTitle = prompt("Novo título:", oldTitle);
  const newContent = prompt("Novo conteúdo:", oldContent);

  if (newTitle && newContent) {
    try {
      const { error } = await supabase.from('tarefas').update({ titulo: newTitle, conteudo: newContent }).eq('id', id);
      if (error) throw error;
      fetchTasks();
    } catch (err) {
      console.error("Erro ao editar tarefa:", err);
    }
  }
}

// Buscar tarefas ao carregar a página
fetchTasks();
