import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500
const ADMIN = "Admin"

const app = express()

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

let currentIndex = 0;
const peopleList = ["Mario", "Giacomo", "Antonio", "Anna", "Digby", "Isabella", "Marco"]; // List of people

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
