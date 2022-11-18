let allTasks = [];
const URL = "http://localhost:7006/";
const fetchHeaders = {
  "Content-Type": "application/json;charset=utf-8",
  "Access-Control-Allow-Origin": "*",
};

window.onload = async () => {
  try {
    const response = await fetch(`${URL}tasks`);

    const result = await response.json();
    allTasks = result;
    render();
  } catch (error) {
    console.error("Failed to load data");
  }
};

const render = () => {
  const content = document.getElementById("content-page");
  if (!content) {
    return;
  }

  while (content.firstChild) {
    content.firstChild.remove();
  }

  allTasks.forEach((task) => {
    const { text, isCheck, _id } = task;
    const container = document.createElement("div");
    container.id = `task-${_id}`;
    container.className = "task-container";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCheck;
    checkbox.onchange = () => {
      onChangeCheckbox(_id, isCheck);
    };
    container.append(checkbox);

    const toDoText = document.createElement("p");
    toDoText.innerText = text;
    toDoText.className = isCheck
      ? "toDoText-task toDoText-done"
      : "toDoText-task";
    toDoText.id = `toDoText-${_id}`;
    container.append(toDoText);

    const buttonImgEdit = document.createElement("button");
    buttonImgEdit.id = `buttonImgEdit-${_id}`;
    const imageEdit = document.createElement("img");
    imageEdit.className = "imgButton";
    imageEdit.src = "svg/pen.svg";
    imageEdit.alt = "Edit";
    if (!isCheck) {
      container.append(buttonImgEdit);
      buttonImgEdit.append(imageEdit);
    }

    const buttonImgDelete = document.createElement("button");
    buttonImgDelete.id = `buttonImgDelete-${_id}`;
    const imageDelete = document.createElement("img");
    imageDelete.className = "imgButton";
    imageDelete.src = "svg/trash-alt.svg";
    imageDelete.alt = "Delete";
    container.append(buttonImgDelete);
    buttonImgDelete.append(imageDelete);

    content.prepend(container);

    if (isCheck) {
      content.append(container);
    }

    buttonImgDelete.onclick = () => {
      deleteTask(_id);
    };

    buttonImgEdit.onclick = () => {
      editTask(task);
    };
  });
};

const addTask = async () => {
  try {
    const inputAddTask = document.getElementById("add-task");
    if (!inputAddTask) {
      return;
    }
    const response = await fetch(`${URL}tasks`, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify({
        text: inputAddTask.value,
        isCheck: false,
      }),
    });
    const result = await response.json();
    allTasks.push(result);
    inputAddTask.value = "";
    render();
  } catch (error) {
    console.error("Failed to add a task");
  }
};

const deleteTask = async (_id) => {
  try {
    allTasks = allTasks.filter((element) => element._id !== _id);
    await fetch(`${URL}tasks/${_id}`, {
      method: "DELETE",
      headers: fetchHeaders,
    });
    render();
  } catch (error) {
    console.error("Failed to delete task");
  }
};

const deleteTasks = async () => {
  allTasks = [];
  try {
    await fetch(`${URL}tasks`, {
      method: "DELETE",
      headers: fetchHeaders,
    });
    render();
  } catch (error) {
    console.error("Failed to delete tasks");
  }
};

const onChangeCheckbox = async (_id, isCheck) => {
  try {
    const response = await fetch(`${URL}tasks/${_id}/checkbox`, {
      method: "PATCH",
      headers: fetchHeaders,
      body: JSON.stringify({
        isCheck: !isCheck,
      }),
    });
    const data = await response.json();
    allTasks.forEach((task) => {
      if (data._id === task._id) {
        task.isCheck = data.isCheck;
      }
    });
    render();
  } catch (error) {
    console.error("Failed to mark the task");
  }
};

const editTask = (task) => {
  try {
    const { text, _id } = task;
    const inputEdit = document.createElement("input");
    inputEdit.id = `inputEdit-${_id}`;
    inputEdit.type = "text";
    inputEdit.value = text;

    const buttonImgDone = document.createElement("button");
    buttonImgDone.id = `buttonImgDone-${_id}`;
    const imageDone = document.createElement("img");
    imageDone.className = "imgButton";
    imageDone.src = "svg/check.svg";
    imageDone.alt = "Save";
    buttonImgDone.append(imageDone);

    const buttonImgCancel = document.createElement("button");
    buttonImgCancel.id = `buttonImgCancel-${_id}`;
    const imageCancel = document.createElement("img");
    imageCancel.className = "imgButton";
    imageCancel.src = "svg/times.svg";
    imageCancel.alt = "Cancel";
    buttonImgCancel.append(imageCancel);

    const container = document.getElementById(`task-${_id}`);
    if (!container) {
      return;
    }

    const containerReplace = document.createElement("div");
    containerReplace.className = "containerReplace";
    containerReplace.append(inputEdit, buttonImgDone, buttonImgCancel);
    container.replaceWith(containerReplace);

    buttonImgDone.onclick = () => doneTask(_id);

    buttonImgCancel.onclick = () => cancelTask(_id);
  } catch (error) {
    console.error("Failed to edit task");
  }
};

const doneTask = async (_id) => {
  try {
    const inputEdit = document.getElementById(`inputEdit-${_id}`);
    if (!inputEdit) {
      return;
    }
    const response = await fetch(`${URL}tasks/${_id}/text`, {
      method: "PATCH",
      headers: fetchHeaders,
      body: JSON.stringify({
        text: inputEdit.value,
      }),
    });
    const data = await response.json();

    allTasks.forEach((task) => {
      if (task._id === data._id) {
        task.text = data.text;
      }
    });

    render();
  } catch (error) {
    console.error("Failed to save changes");
  }
};

const cancelTask = (_id) => {
  try {
    const inputEdit = document.getElementById(`inputEdit-${_id}`);
    const buttonImgDone = document.getElementById(`buttonImgDone-${_id}`);
    const buttonImgCancel = document.getElementById(`buttonImgCancel-${_id}`);
    const buttonImgDelete = document.getElementById(`buttonImgDelete-${_id}`);
    const buttonImgEdit = document.getElementById(`buttonImgEdit-${_id}`);
    const toDoText = document.getElementById(`toDoText-${_id}`);
    inputEdit.replaceWith(toDoText);
    buttonImgDone.replaceWith(buttonImgEdit);
    buttonImgCancel.replaceWith(buttonImgDelete);
    render();
  } catch (error) {
    console.error("Failed to cancel task editing");
  }
};
