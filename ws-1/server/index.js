import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

let currentIndex = 0;
const people = ["Lee", "Giacomo", "Marie", "Stacey", "Cameron", "Billy", "Sam"]; // List of people

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    // Send initial data to the client
    socket.emit("currentPerson", people[currentIndex]);
    socket.emit("peopleList", people);

    socket.on('message', data => {
        console.log(data)
        io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)
    })

    // Handle next person action
    socket.on('nextPerson', () => {
        currentIndex = (currentIndex + 1) % people.length;
        io.emit("currentPerson", people[currentIndex]);
    });
})

httpServer.listen(3500, () => console.log('listening on port 3500'))
