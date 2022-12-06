let aTasks = [
    // {
    //     text: "test1",
    //     timeSec: 0,
    //     timerStat: true
    // },
    // {
    //     text: "test2",
    //     timeSec: 0,
    //     timerStat: false
    // },

];

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