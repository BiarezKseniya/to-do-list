let aTasks = [
    // {
    //     text: "test1",
    //     timeSec: 0,
    //     timerStat: true,
    //     timerDiv: null
    // },
    // {
    //     text: "test2",
    //     timeSec: 0,
    //     timerStat: false,
    //     timerDiv: null
    // },

];

let oldIndexOfElement; 

const startTimer = () => {
    setInterval(() => {
        aTasks.forEach((element) => {
            if (element.timerStat) {
                element.timeSec += 1;
                if (element.timerDiv) {
                    element.timerDiv.textContent = formatTime(element.timeSec);
                }
            }
        });
    }, 1000);
}

startTimer();



const localStorageKey = "taskHist";

const getLS = () => {
    const tasksHist = localStorage.getItem(localStorageKey);
    aTasks = JSON.parse(tasksHist || "[]");

};

const setLS = () => {
    const aTasksToSave = aTasks.map((row) => {
        let out = { ...row };
        delete out.timerDiv;
        return out;
    });
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
    taskEl.setAttribute("draggable", "true");
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

    const timerView = document.createElement("div");
    timerView.classList.add("timer-text");
    timerView.textContent = formatTime(oTask.timeSec);
    oTask.timerDiv = timerView;

    const timerBut = document.createElement("button");
    timerBut.classList.add("timer-launch");

    formatPlayBut(oTask.timerStat, timerBut);

    taskActionsEl.appendChild(taskEditEl);
    taskActionsEl.appendChild(taskDeleteEl);
    taskActionsEl.appendChild(timerView);
    taskActionsEl.appendChild(timerBut);
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

    timerBut.addEventListener('click', () => {
        oTask.timerStat = !oTask.timerStat;
        formatPlayBut(oTask.timerStat, timerBut);
    })


      taskEl.addEventListener('dragstart', handleDragStart);
      taskEl.addEventListener('dragover', handleDragOver);
      taskEl.addEventListener('dragend', handleDragEnd);
      taskEl.addEventListener('drop', handleDrop);
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

        aTasks.push({
            text: task,
            timeSec: 0,
            timerStat: false
        });

        render();
        input.value = "";

    })
})

function handleDragStart (e) {
    e.target.classList.add('drag');
    oldIndexOfElement = getPosition(e);
  }

function handleDragEnd (e) {
    const newIndexOfElement = getPosition(e);
    const change = aTasks[oldIndexOfElement]; 

    e.target.classList.remove('drag');

    if (oldIndexOfElement < newIndexOfElement) {
        for (let i = oldIndexOfElement + 1; i < newIndexOfElement + 1; i++) {
            aTasks[i - 1] = aTasks[i];
        }
    } else {
        for (let i = oldIndexOfElement; i > newIndexOfElement; i--) {
            aTasks[i] = aTasks[i - 1];
        }
    }
    aTasks[newIndexOfElement] = change;
  }

function handleDrop (e) {
   e.stopPropagation(); // препятствует перенаправлению в браузере.
  }

  function handleDragOver(e) {
    const taskList = document.getElementById('tasks');
    const activeElement = document.querySelector('.drag');
    e.preventDefault();
    const currentElement = this;
    const nextElement = (currentElement == activeElement.nextElementSibling) ?
    currentElement.nextElementSibling :
    currentElement;
    taskList.insertBefore(activeElement, nextElement);
  }

  function getPosition(e) {
    const taskList = document.getElementById('tasks');
    //const tasks = Array.prototype.slice.call(taskList.children);
    const tasks = Array.from(taskList.children)
    return tasks.indexOf(e.target);
  }

const formatTime = (timeSec) => {
    const sec = Math.trunc(timeSec % 60);
    const min = Math.trunc(timeSec % 3600 / 60);
    const hour = Math.trunc(timeSec / 3600);
    return `${hour < 10 ? ("0" + hour) : hour}:${min < 10 ? ("0" + min) : min}:${sec < 10 ? ("0" + sec) : sec}`;
}

const formatPlayBut = (flag, timerBut) => {
    if (flag) {
        timerBut.classList.remove('timer-launch');
        timerBut.classList.add('timer-launch-pause');            
    } else {
        timerBut.classList.remove('timer-launch-pause');
        timerBut.classList.add('timer-launch');
    }
}