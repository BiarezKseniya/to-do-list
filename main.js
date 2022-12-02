let aTasks = [];

const localStorageKey = "taskHist";

const getLS = () => {
    const tasksHist = localStorage.getItem(localStorageKey);
    aTasks = JSON.parse(tasksHist || "[]"); 

};

const setLS = () => {
    localStorage.setItem(localStorageKey, JSON.stringify(aTasks));
};

window.addEventListener('beforeunload', setLS);
window.addEventListener('load', getLS);

const render = () => {
    const list = document.querySelector("#tasks");
    list.innerHTML = "";
    aTasks.forEach(element => {
        addTaskToView(element, list);
    });
};

const addTaskToView = (oTask, list) => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");
    const taskContentEl = document.createElement("div");
    taskContentEl.classList.add("content");
    taskEl.appendChild(taskContentEl);
    const taskInputEl = document.createElement("input");
    taskInputEl.classList.add("text");
    taskInputEl.type = "text";
    taskInputEl.value = oTask.text;
    taskInputEl.setAttribute("readonly", "readonly");
    taskContentEl.appendChild(taskInputEl);
    const taskActionsEl = document.createElement("div");
    taskActionsEl.classList.add("actions");
    const taskEditEl = document.createElement("button");
    taskEditEl.classList.add("edit");
    taskEditEl.innerHTML = "Edit";
    const taskDeleteEl = document.createElement("button");
    taskDeleteEl.classList.add("delete");
    taskDeleteEl.innerHTML = "Delete";

    taskActionsEl.appendChild(taskEditEl);
    taskActionsEl.appendChild(taskDeleteEl);
    taskEl.appendChild(taskActionsEl);
    list.appendChild(taskEl);

    taskEditEl.addEventListener('click', () => {
        if (taskEditEl.innerText.toLowerCase() == "edit") {
            taskInputEl.removeAttribute("readonly");
            taskInputEl.focus();
            taskEditEl.innerText = "Save"
        } else {
            taskInputEl.setAttribute("readonly", "readonly");
            taskEditEl.innerText = "Edit";
            oTask.text = taskInputEl.value;
        }
    })

    taskDeleteEl.addEventListener('click', () => {
        list.removeChild(taskEl);

        let index = aTasks.indexOf(oTask);
        aTasks.splice(index, 1);
    })

}

window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");

    render();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = input.value;

        if (!task) {
            alert("Please fill out the task");
            return;
        }

        aTasks.push({ text: task });

        render();
        input.value = "";

    })
})