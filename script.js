let noteList = [];

const collapsedInput = document.getElementById("collapsed-input");
const expandedInput = document.getElementById("expanded-input");
const titleEl = document.getElementById("title");
const noteEl = document.getElementById("note");
const closeBtn = document.getElementById("closeBtn");
const noteListContainer = document.getElementById("note-list");

// HELPER: SAFELY LOAD NOTES - THIS FIXES YOUR BUG
function loadNotes() {
    let data = localStorage.getItem("notes");
    try {
        noteList = JSON.parse(data);
        // If it's not an array, reset it
        if(!Array.isArray(noteList)) {
            noteList = [];
        }
    } catch(e) {
        noteList = []; // if corrupted, reset
    }
    return noteList;
}

// LOAD
window.onload = displayNotes;

// EXPAND
collapsedInput.addEventListener("click", () => {
    collapsedInput.style.display = "none";
    expandedInput.style.display = "block";
    titleEl.focus();
});

// SAVE + COLLAPSE
function saveAndCollapse() {
    let title = titleEl.value.trim();
    let note = noteEl.value.trim();
    
    if(title !== "" || note !== "") {
        noteList = loadNotes(); // use safe loader
        noteList.unshift({ id: Date.now(), title, note });
        localStorage.setItem("notes", JSON.stringify(noteList));
    }

    titleEl.value = "";
    noteEl.value = "";
    expandedInput.style.display = "none";
    collapsedInput.style.display = "block";
    displayNotes();
}

closeBtn.addEventListener("click", saveAndCollapse);

// CLICK OUTSIDE
document.addEventListener("click", (e) => {
    if(!e.target.closest("#user-input") && expandedInput.style.display === "block") {
        saveAndCollapse();
    }
})

// DISPLAY
function displayNotes() {
    noteListContainer.innerHTML = "";
    noteList = loadNotes(); // use safe loader

    if(noteList.length === 0) {
        noteListContainer.innerHTML = `<p style="text-align:center; color:#80868b; margin-top:40px;">Notes you add appear here</p>`;
        return;
    }

    noteList.forEach(note => {
        let container = document.createElement("section");
        container.classList.add("note-card");
        container.innerHTML = `
            <button onclick="deleteNote(${note.id}); event.stopPropagation();" class="delete-btn">×</button>
            <h3>${note.title}</h3>
            <p>${note.note}</p>
        `;
        noteListContainer.appendChild(container);
    })
}

// DELETE
function deleteNote(id) {
    noteList = loadNotes();
    noteList = noteList.filter(note => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(noteList));
    displayNotes();
}
