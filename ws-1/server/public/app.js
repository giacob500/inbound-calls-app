const socket = io('ws://localhost:3500')

const people = ["Mario", "Giovanni", "Emma"]; // List of people

let currentIndex = 0;

function displayPeople() {
  document.getElementById("currentPerson").innerText = people[currentIndex];
  
  const listItems = people.map((person, index) => {
    if (index === currentIndex) {
      return `<li><strong>${person}</strong></li>`;
    } else {
      return `<li>${person}</li>`;
    }
  });
  
  document.getElementById("peopleList").innerHTML = listItems.join("");
}

function nextPerson() {
  currentIndex = (currentIndex + 1) % people.length;
  displayPeople();
}

// Initial display
displayPeople();


function sendMessage(e) {
    e.preventDefault()
    const input = document.querySelector('input')
    if (input.value) {
        socket.emit('message', input.value)
        input.value = ""
    }
    input.focus()
}

document.querySelector('form')
    .addEventListener('submit', sendMessage)

// Listen for messages 
socket.on("message", (data) => {
    const li = document.createElement('li')
    li.textContent = data
    document.querySelector('ul').appendChild(li)
})