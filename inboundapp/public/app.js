const socket = io('ws://localhost:3500')

const msgInput = document.querySelector('#message')
const nameInput = document.querySelector('#name')
const staffInput = document.querySelector('#staff')
const chatRoom = document.querySelector('#room')
const activity = document.querySelector('.activity')
const usersList = document.querySelector('.user-list')
const staffList = document.querySelector('.staff-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')


function sendMessage(e) {
    e.preventDefault() /* Submit the form without reloading the page */
    if (nameInput.value && msgInput.value && chatRoom.value) {
        /* After we send the message we want to erase what's in the msgInput */
        socket.emit('message', {
            name: nameInput.value,
            text: msgInput.value
        })
        msgInput.value = ""
    }
    msgInput.focus()
}

function addStaff(e) {
    e.preventDefault() /* Submit the form without reloading the page */
    if (nameInput.value && staffInput.value && chatRoom.value) {
        /* After we send the message we want to erase what's in the msgInput */
        socket.emit('message', {
            name: nameInput.value,
            text: msgInput.value
        })
        staffInput.value = ""
    }
    staffInput.focus()
}

function enterRoom(e) {
    e.preventDefault()
    if (nameInput.value && chatRoom.value) {
        socket.emit('enterRoom', {
            name: nameInput.value,
            room: chatRoom.value
        })
    }
}

document.querySelector('.form-msg').addEventListener('submit', sendMessage)

document.querySelector('.form-staff').addEventListener('submit', addStaff)

document.querySelector('.form-join').addEventListener('submit', enterRoom)

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value)
})

// Listen for messages
socket.on("message", (data) => {
    activity.textContent = ""
    const {name, text, time} = data         // Destructuring the data variable
    const li = document.createElement('li')
    li.className = 'post'
    if (name === nameInput.value) li.className = 'post post--left'
    if (name !== nameInput.value && name !== 'Admin') li.className = 'post post--right'
    if (name !== 'Admin') {
        li.innerHTML = `<div class="post__header ${name === nameInput.value
            ? 'post__header--user'
            : 'post__header--reply'
        }">
        <span class="post__header--name">${name}</span>
        <span class="post__header--time">${time}</span>
        </div>
        <div class="post__text">${text}</div>`
    } else {
        li.innerHTML = `<div class="post__text">${text}</div>`
    }
    document.querySelector('.chat-display').appendChild(li)

    // Chat scrolling down as new messages come in
    chatDisplay.scrollTop = chatDisplay.scrollHeight
})

let activityTimer

socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`

    // Clear after 1 second
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 1000)
})


// In function below, "users" is being distructured immediately when received as parameter (this is why I use ({variable}))
socket.on('userList', ({ users }) => {
    showUsers(users)
})

socket.on('staffList', ({ staff }) => {
    showStaff(staff)
})

socket.on('roomList', ({ rooms }) => {
    showRooms(rooms)
})

function showStaff(staff) {
    staffList.textContent = ''
    if (staff) {
        staffList.innerHTML = `<em>Staff members in ${chatRoom.value}:</em>`
        staff.forEach((user, i) => {
            staffList.textContent += ` ${user.name}`
            if (staff.length > 1 && i !== staff.length - 1) {
                staffList.textContent += ","
            }
        })
    }
}

function showUsers(users) {
    usersList.textContent = ''
    if (users) {
        usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
        users.forEach((user, i) => {
            usersList.textContent += ` ${user.name}`
            if (users.length > 1 && i !== users.length - 1) {
                usersList.textContent += ","
            }
        })
    }
}

function showRooms(rooms) {
    roomList.textContent = ''
    if (rooms) {
        roomList.innerHTML = '<em>Active rooms:</em>'
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`
            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ","
            }
        })
    }
}