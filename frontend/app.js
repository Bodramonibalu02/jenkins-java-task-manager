const API = "http://localhost:8085";
const list = document.querySelector("#taskList");
const form = document.querySelector("#taskForm");
const filter = document.querySelector("#filter");
const message = document.querySelector("#message");
const apiStatus = document.querySelector("#apiStatus");

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

async function loadTasks() {
  try {
    const tasks = await request("/api/tasks");
    apiStatus.textContent = "API connected";
    const visible = tasks.filter(task =>
      filter.value === "all" ||
      (filter.value === "active" && !task.completed) ||
      (filter.value === "completed" && task.completed)
    );
    list.innerHTML = "";
    if (!visible.length) {
      list.innerHTML = '<li class="empty">No tasks here yet. Add your first task above.</li>';
      return;
    }
    visible.forEach(task => {
      const item = document.createElement("li");
      item.className = `task ${task.completed ? "done" : ""}`;
      const info = document.createElement("div");
      info.className = "task-info";
      const title = document.createElement("strong");
      title.textContent = task.title;
      const desc = document.createElement("small");
      desc.textContent = task.description || "No description";
      info.append(title, desc);
      const toggle = document.createElement("button");
      toggle.textContent = task.completed ? "Undo" : "Complete";
      toggle.addEventListener("click", async () => {
        await request(`/api/tasks/${task.id}/toggle`, { method: "PATCH" });
        loadTasks();
      });
      const del = document.createElement("button");
      del.className = "delete";
      del.textContent = "Delete";
      del.addEventListener("click", async () => {
        await request(`/api/tasks/${task.id}`, { method: "DELETE" });
        loadTasks();
      });
      item.append(info, toggle, del);
      list.append(item);
    });
  } catch (error) {
    apiStatus.textContent = "API unavailable";
    message.textContent = "Could not reach the API. Check that Docker Compose is running.";
    console.error(error);
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "";
  try {
    await request("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: document.querySelector("#title").value.trim(),
        description: document.querySelector("#description").value.trim()
      })
    });
    form.reset();
    loadTasks();
  } catch (error) {
    message.textContent = error.message;
  }
});
filter.addEventListener("change", loadTasks);
loadTasks();
