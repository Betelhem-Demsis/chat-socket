const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const users = {};
const messages = [];

app.post("/register", (req, res) => {
  const { phoneNumber, name } = req.body;
  if (!phoneNumber || !name) {
    return res
      .status(400)
      .json({ message: "Phone number and name are required" });
  }

  if (users[phoneNumber]) {
    return res.status(400).json({ message: "Phone number already registered" });
  }

  users[phoneNumber] = { id: null, name };
  res.status(200).json({ success: true, users });
});

app.get("/users", (req, res) => {
  const userList = Object.keys(users).map((phoneNumber) => ({
    phoneNumber,
    name: users[phoneNumber].name,
  }));
  res.json(userList);
});

app.get("/messages", (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res
      .status(400)
      .json({ message: "Missing from or to query parameters" });
  }
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.from === from && msg.to === to) ||
      (msg.from === to && msg.to === from)
  );
  res.json(filteredMessages);
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", ({ phoneNumber, name }) => {
    if (!phoneNumber || !name) {
      socket.emit("error", { message: "Invalid registration data" });
      return;
    }
    users[phoneNumber] = { id: socket.id, name };
    console.log(`${name} registered with phone number: ${phoneNumber}`);
    io.emit("registered", { success: true, users });
  });

  socket.on("send_message", ({ from, to, text }) => {
    const recipient = users[to];
    if (recipient) {
      io.to(recipient.id).emit("receive_message", { from, text });
    }
    messages.push({ from, to, text });
  });

  socket.on("disconnect", () => {
    for (let phoneNumber in users) {
      if (users[phoneNumber].id === socket.id) {
        console.log(`${users[phoneNumber].name} disconnected`);
        delete users[phoneNumber];
        io.emit("user_disconnected", { phoneNumber });
        break;
      }
    }
  });
});

server.listen(3005, () => {
  console.log("Server is running on port 3005");
});
