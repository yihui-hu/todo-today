// to get current date

function getDate() {
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    document.getElementById("current-date").innerHTML =
        day + "/" + month + "/" + year;
}

getDate();

// snippet of jquery for testing?

// $(document).ready(function () {
//     // hide work notebook on default
//     $("#work-notebook").hide();

//     $("#personal").click(function () {
//         $("#personal-notebook").show();
//         $("#work-notebook").hide();
//     });

//     $("#work").click(function () {
//         $("#work-notebook").show();
//         $("#personal-notebook").hide();
//     })
// });

$(document).ready(function () {
    // hide notes by default
    $("#personal-notes").hide();

    $("#personal").click(function () {
        $("#personal-todos").show();
        $("#personal-notes").hide();
    });

    $("#notes").click(function () {
        $("#personal-notes").show();
        $("#personal-todos").hide();
    })
});

// main to-do functionality

const form = document.getElementById("form");
const input = document.getElementById("input");
// to-dos and completed list
const todos = document.getElementById("todos");
const completed = document.getElementById("completed");

let todoItems = JSON.parse(localStorage.getItem("todos")) || [];

// get items from localStorage on reload
if (localStorage.getItem("todos")) {
    todoItems.map((todo) => {
        createtodo(todo);
    });
}

let completedItems = JSON.parse(localStorage.getItem("completed")) || [];

// get items from localStorage on reload
if (localStorage.getItem("completed")) {
    completedItems.map((completed) => {
        createcompleted(completed);
    })
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const todoText = input.value;

    if (todoText != "") {
        const todoItem = {
            id: new Date().getTime(),
            name: todoText,
            isCompleted: false,
        };

        todoItems.push(todoItem);
        localStorage.setItem("todos", JSON.stringify(todoItems));

        createtodo(todoItem);

        form.reset();
    }
});

function createtodo(todoItem) {
    const todoEl = document.createElement("li");
    todoEl.setAttribute("id", todoItem.id);
    const todoElMarkup = `
    <div class="checkbox-wrapper">
      <input type="checkbox" id="${todoItem.name}-${todoItem.id}" name="todoItems" ${todoItem.isCompleted ? "checked" : ""
        }>
    <span ${!todoItem.isCompleted ? "contenteditable" : ""} class="todo">${todoItem.name}</span>
    <button class="remove-todo" style="float: right">✗</button>
    </div>
    `;
    todoEl.innerHTML = todoElMarkup;
    todos.append(todoEl);
}

function createcompleted(completedItem) {
    const completedEl = document.createElement("li");
    completedEl.setAttribute("id", completedItem.id);
    completedEl.setAttribute("class", "completed");
    const completedElMarkup = `
    <div class="checkbox-wrapper">
      <input type="checkbox" id="${completedItem.name}-${completedItem.id}" name="completedItems" ${completedItem.isCompleted ? "checked" : ""
        }>
    <span ${!completedItem.isCompleted ? "contenteditable" : ""} class="todo">${completedItem.name}</span>
    <button class="remove-todo" style="float: right">✗</button>
    </div>
    `;
    completedEl.innerHTML = completedElMarkup;
    completed.append(completedEl);
}

todos.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
    }
});

todos.addEventListener("input", (e) => {
    const todoId = e.target.closest("li").id;
    updateTodo(todoId, e.target);
});

completed.addEventListener("input", (e) => {
    const completedId = e.target.closest("li").id;
    updateCompleted(completedId, e.target);
});

function updateTodo(todoId, el) {
    const todo = todoItems.find((todo) => todo.id === parseInt(todoId));

    if (el.hasAttribute("contentEditable")) {
        // set todo object name member variable to new text
        todo.name = el.textContent;
    } else {
        // update completion status of todo item
        const span = el.nextElementSibling.nextElementSibling;
        todo.isCompleted = !todo.isCompleted;
        if (todo.isCompleted) {
            span.removeAttribute("contenteditable");
            el.setAttribute("checked", "");

            // creates duplicate of completed item
            const todoEl = document.createElement("li");
            todoEl.setAttribute("id", todo.id);
            todoEl.setAttribute("class", "completed");
            const todoElMarkup = `
            <div class="checkbox-wrapper">
              <input type="checkbox" id="${todo.name}-${todo.id}" name="todoItems" ${todo.isCompleted ? "checked" : ""
                }>
            <span ${!todo.isCompleted ? "contenteditable" : ""} class="todo">${todo.name}</span>
            <button class="remove-todo" style="float: right">✗</button>
            </div>
            `;
            todoEl.innerHTML = todoElMarkup;
            completed.append(todoEl);

            const completedItem = {
                id: todo.id,
                name: todo.name,
                isCompleted: todo.isCompleted
            };

            completedItems.push(completedItem);
            localStorage.setItem("completed", JSON.stringify(completedItems));

            removeTodo(todoId);
        } else {
            el.removeAttribute("checked");
            span.setAttribute("contenteditable", "");
        }
    }

    localStorage.setItem("todos", JSON.stringify(todoItems));
}

function updateCompleted(completedId, el) {
    const completed = completedItems.find((completed) => completed.id === parseInt(completedId));

    const span = el.nextElementSibling.nextElementSibling;
    completed.isCompleted = !completed.isCompleted;
    if (completed.isCompleted) {
        console.log("test");
        span.removeAttribute("contenteditable");
        el.setAttribute("checked", "");
    } else {
        el.removeAttribute("checked");
        span.setAttribute("contenteditable", "");

        // creates duplicate of completed item
        const todoEl = document.createElement("li");
        todoEl.setAttribute("id", completed.id);
        const todoElMarkup = `
            <div class="checkbox-wrapper">
            <input type="checkbox" id="${completed.name}-${completed.id}" name="todoItems" ${completed.isCompleted ? "checked" : ""
            }>
            <span ${!completed.isCompleted ? "contenteditable" : ""} class="todo">${completed.name}</span>
            <button class="remove-todo" style="float: right">✗</button>
            </div>
        `;

        const todoItem = {
            id: completed.id,
            name: completed.name,
            isCompleted: completed.isCompleted
        };

        todoItems.push(todoItem);
        localStorage.setItem("todos", JSON.stringify(todoItems));

        removeCompleted(completedId);

        todoEl.innerHTML = todoElMarkup;
        todos.append(todoEl);
    }

    localStorage.setItem("completed", JSON.stringify(completedItems));
}

todos.addEventListener("click", (e) => {
    if (
        // delete button is clicked on
        e.target.classList.contains("remove-todo") ||
        e.target.parentElement.classList.contains("remove-todo")
    ) {
        // get the list item that the delete button belongs to
        const todoId = e.target.closest("li").id;
        // prepare to remove said list item
        removeTodo(todoId);
    }
});

completed.addEventListener("click", (e) => {
    if (
        // delete button is clicked on
        e.target.classList.contains("remove-todo") ||
        e.target.parentElement.classList.contains("remove-todo")
    ) {
        // get the list item that the delete button belongs to
        const todoId = e.target.closest("li").id;
        // prepare to remove said list item
        removeCompleted(todoId);
    }
});

function removeTodo(todoId) {
    // presumably filter out todo that is meant to be deleted
    todoItems = todoItems.filter((todo) => todo.id !== parseInt(todoId));
    // update local storage
    localStorage.setItem("todos", JSON.stringify(todoItems));
    // remove todo list item
    document.getElementById(todoId).remove();
}

function removeCompleted(todoId) {
    // presumably filter out todo that is meant to be deleted
    completedItems = completedItems.filter((todo) => todo.id !== parseInt(todoId));
    // update local storage
    localStorage.setItem("completed", JSON.stringify(completedItems));
    // remove todo list item
    document.getElementById(todoId).remove();
}

function trash() {
    localStorage.removeItem('completed');
    completed.innerHTML = "";
}

// Add new to-do category or new note

function addTodo() {
    const todos = document.getElementById("todos-sidebar");
    const newtodo = document.createElement("li");
    newtodo.innerText = "Untitled";
    todos.appendChild(newtodo);
}

function addNote() {
    const notes = document.getElementById("notes-sidebar");
    const note = document.createElement("li");
    note.innerText = "Untitled";
    notes.appendChild(note);
}

// Instructions on how to use the app :)

// const todoInitial = document.createElement('li');
// todoInitial.innerText = "Click on me to complete the task!";
// todos.appendChild(todoInitial);

// todoInitial.addEventListener('click', () => {
//     if (todoInitial.classList.contains('completed')) {
//         todoInitial.classList.toggle("completed");
//         todos.appendChild(todoInitial)
//     } else {
//         todoInitial.classList.toggle("completed");
//         completed.appendChild(todoInitial);
//     }
// })

// const todoCompleted = document.createElement('li');
// todoCompleted.innerText = "Click on me to undo completion!";
// todoCompleted.classList.toggle('completed');
// completed.appendChild(todoCompleted);

// todoCompleted.addEventListener('click', () => {
//     if (todoCompleted.classList.contains('completed')) {
//         todoCompleted.classList.toggle("completed");
//         todos.appendChild(todoCompleted)
//     } else {
//         todoCompleted.classList.toggle("completed");
//         completed.appendChild(todoCompleted);
//     }
// })

// for notes

const notesContainer = document.getElementById('personal-notes');
const addNoteButton = notesContainer.querySelector('.add-notes');

addNoteButton.addEventListener("click", () => addNote());

getNotes().forEach(note => {
    const notesElement = createNoteElement(note.id, note.content);
    notesContainer.append(notesElement);
})

function getNotes() {
    return JSON.parse(localStorage.getItem("notes") || "[]");
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function createNoteElement(id, content) {
    const element = document.createElement("textarea");

    element.classList.add("notes");
    element.value = content;
    element.placeholder = "Jot something down...";
    
    element.addEventListener("change", () => {
        updateNote(id, element.value);
    });

    element.addEventListener("dblclick", () => {
        const doDelete = confirm("Are you sure you wish to delete this note?");
        if (doDelete) {
            deleteNote(id, element);
        }
    });

    return element;
}

function addNote() {
    const existingNotes = getNotes();
    const noteObject = {
        id: Math.floor(Math.random() * 100000),
        content: ""
    };

    const noteElement = createNoteElement(noteObject.id, noteObject.content);
    notesContainer.append(noteElement);
    existingNotes.push(noteObject);
    saveNotes(existingNotes);
}

function updateNote(id, newContent) {
    const notes = getNotes(); 
    const targetNote = notes.filter(note => note.id == id)[0];

    targetNote.content = newContent;
    saveNotes(notes);
}

function deleteNote(id, element) {
    const notes = getNotes().filter(note => note.id != id);
    saveNotes(notes);
    notesContainer.removeChild(element);
}