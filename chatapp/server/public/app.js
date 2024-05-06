const socket = io('ws://localhost:3500')

function sendMessage(e) {
    e.preventDefault() /* Submit the form without reloading the page */
    const input = document.querySelector('input')
    if (input.value) {
        /* After we send the message we want to erase what's in the input */
        socket.emit('message', input.value)
        input.value = ""
    }
    input.focus()
}

document.querySelector('form').addEventListener('submit', sendMessage)

// Listen for messages
socket.on("message", (data) => {
    const li = document.createElement('li')
    li.textContent = data
    document.querySelector('ul').appendChild(li)
})