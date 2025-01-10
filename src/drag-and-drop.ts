import { getTasks, saveTask } from "./storage.js";

export function enableDragAndDrop() {
    const taskRows = document.querySelectorAll('tr');
    
    taskRows.forEach(row => {
        row.setAttribute('draggable', 'true');
        
        row.addEventListener('dragstart', (e) => {
            const target = e.target as HTMLElement;
            if (target) {
                target.classList.add('dragging');
            }
        });

        row.addEventListener('dragend', (e) => {
            const target = e.target as HTMLElement;
            if (target) {
                target.classList.remove('dragging');
            }
        });
    });

    const statusColumns = document.querySelectorAll('.status-column');
    
    statusColumns.forEach(col => {
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.classList.add('over');
        });
        
        col.addEventListener('dragleave', (e) => {
            col.classList.remove('over');
        });
        
        col.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggingTaskId = document.querySelector('.dragging')?.getAttribute('data-id');
            const taskRow = document.querySelector(`tr[data-id="${draggingTaskId}"]`);

            if (taskRow) {
                const newStatus = col.getAttribute('data-status');
                if (newStatus && draggingTaskId) {
                    updateTaskStatus(draggingTaskId, newStatus);
                    displayTasks(getTasks());
                }
            }

            col.classList.remove('over');
        });
    });
}

function updateTaskStatus(taskId: string, newStatus: string) {
    const tasks = getTasks();
    const taskToUpdate = tasks.find(task => task.id === taskId);
    
    if (taskToUpdate) {
        taskToUpdate.etat_tache = newStatus;
        saveTask(taskToUpdate); // Mettre à jour la tâche avec le nouveau statut
    }
}
function displayTasks(arg0: any[]) {
    throw new Error("Function not implemented.");
}

