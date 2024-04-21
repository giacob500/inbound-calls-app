// Connect to the server
const socket = io();

// Get references to DOM elements
const nextButton = document.getElementById('nextButton');
const mainPerson = document.getElementById('mainPerson');
const remainingPeople = document.getElementById('remainingPeople');

// Listen for 'update' event from the server
socket.on('update', (data) => {
    // Update the main person
    mainPerson.textContent = data.currentPerson;

    // Update the remaining people
    remainingPeople.textContent = data.remainingPeople.join(', ');
});

// Event listener for the 'Next' button
nextButton.addEventListener('click', () => {
    // Emit 'next' event to the server
    socket.emit('next');
});
