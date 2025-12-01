document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const tasksList = document.getElementById('tasksList');
    const tasksCount = document.getElementById('tasksCount');
    
    let tasks = [];
    
    loadTasks();
    
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!taskTitle.value.trim()) {
            showValidationError('Введите название задачи');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            title: taskTitle.value.trim(),
            description: taskDescription.value.trim(),
            date: new Date().toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            }),
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
        taskTitle.focus();
    });
    
    function renderTasks() {
        if (tasks.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚡</div>
                    <p class="empty-text">Нет активных задач</p>
                    <p class="empty-subtext">Добавьте первую задачу чтобы начать работу</p>
                </div>
            `;
            tasksCount.textContent = '0';
            return;
        }
        
        const activeTasks = tasks.filter(task => !task.completed);
        tasksCount.textContent = activeTasks.length;
        
        tasksList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-card ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <div class="task-header">
                    <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
                        <button class="btn-complete ${task.completed ? 'checked' : ''}" data-id="${task.id}" title="${task.completed ? 'Вернуть в работу' : 'Отметить выполненной'}">
                            ${task.completed ? '✓' : ''}
                        </button>
                        <div class="task-title">${escapeHtml(task.title)}</div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-icon" data-id="${task.id}" title="Удалить задачу">
                            ×
                        </button>
                    </div>
                </div>
                ${task.description ? `
                    <div class="task-description">${escapeHtml(task.description)}</div>
                ` : ''}
                <div class="task-meta">
                    <div class="task-date">${task.date}</div>
                    <div class="task-status">${task.completed ? 'Выполнено' : 'В работе'}</div>
                </div>
            `;
            tasksList.appendChild(taskElement);
        });
        
        document.querySelectorAll('.btn-complete').forEach(button => {
            button.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-id'));
                toggleTaskComplete(taskId);
            });
        });
        
        document.querySelectorAll('.btn-icon').forEach(button => {
            button.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-id'));
                deleteTask(taskId);
            });
        });
    }
    
    function toggleTaskComplete(id) {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }
    
    function deleteTask(id) {
        if (confirm('Удалить эту задачу?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }
    }
    
    function saveTasks() {
        localStorage.setItem('taskmaster_tasks', JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const savedTasks = localStorage.getItem('taskmaster_tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showValidationError(message) {
        taskTitle.style.borderColor = 'var(--danger)';
        setTimeout(() => {
            taskTitle.style.borderColor = '';
        }, 2000);
    }
});