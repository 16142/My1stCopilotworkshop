// 待辦清單資料儲存鍵名稱
const STORAGE_KEY = "todo-list-items";

// 取得 DOM 節點
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const remainingCount = document.getElementById("remainingCount");

// 從 localStorage 讀取待辦資料，若資料不存在則回傳空陣列
let tasks = loadTasks();

// 讀取任務列表
function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return [];
    }

    const parsedTasks = JSON.parse(savedTasks);
    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch (error) {
    console.error("讀取 localStorage 失敗:", error);
    return [];
  }
}

// 儲存任務列表到 localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// 更新底部未完成數量與空白狀態
function updateSummary() {
  const remaining = tasks.filter((task) => !task.completed).length;
  remainingCount.textContent = `未完成: ${remaining} 項`;

  if (tasks.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }
}

// 建立一筆待辦項目
function createTodoItem(task, index) {
  const item = document.createElement("li");
  item.className = "todo-item";

  if (task.completed) {
    item.classList.add("completed");
  }

  const main = document.createElement("label");
  main.className = "todo-main";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `完成待辦: ${task.text}`);
  checkbox.dataset.index = String(index);

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = task.text;

  main.appendChild(checkbox);
  main.appendChild(text);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "刪除";
  deleteBtn.dataset.index = String(index);

  item.appendChild(main);
  item.appendChild(deleteBtn);

  return item;
}

// 重新繪製清單
function renderTasks() {
  todoList.innerHTML = "";

  tasks.forEach((task, index) => {
    const todoItem = createTodoItem(task, index);
    todoList.appendChild(todoItem);
  });

  updateSummary();
}

// 新增待辦事項
function addTask() {
  const value = todoInput.value.trim();

  // 若輸入為空白，直接忽略，不新增任何項目
  if (!value) {
    todoInput.focus();
    return;
  }

  tasks.push({
    id: Date.now() + Math.random(),
    text: value,
    completed: false,
  });

  todoInput.value = "";
  saveTasks();
  renderTasks();
  todoInput.focus();
}

// 表單送出事件：新增待辦
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

// 勾選完成狀態事件
todoList.addEventListener("change", (event) => {
  const checkbox = event.target;

  if (!(checkbox instanceof HTMLInputElement) || checkbox.type !== "checkbox") {
    return;
  }

  const index = Number(checkbox.dataset.index);

  if (Number.isNaN(index) || index < 0 || index >= tasks.length) {
    return;
  }

  tasks[index].completed = checkbox.checked;
  saveTasks();
  renderTasks();
});

// 刪除待辦事件
todoList.addEventListener("click", (event) => {
  const button = event.target;

  if (!(button instanceof HTMLElement) || !button.classList.contains("delete-btn")) {
    return;
  }

  const index = Number(button.dataset.index);

  if (Number.isNaN(index) || index < 0 || index >= tasks.length) {
    return;
  }

  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
});

// 初始化畫面
renderTasks();
