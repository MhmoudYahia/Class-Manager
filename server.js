const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userModel")
const http = require("http");

process.on("uncaughtException", (err) => {
  console.log("uncaught exception".toUpperCase(), ",Shutting down......");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 2000;

const app = require("./app");

const DBString = process.env.DATABASE.replace(
  "<password>",
  process.env.PASSWORD
);

let server;
mongoose.connect(DBString).then(() => {
  console.log("DB connection established");
  server = http.createServer(app).listen(PORT, function () {
    console.log("Express server listening on port " + PORT);
  });


  // socket set up
  if (server) {
    const io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    global.onlineUsers = new Map(); //It's worth noting that using a global variable to store online users may not be the most ideal approach in a production environment, especially if you have multiple instances of the server running. In such cases, you might need to consider a distributed caching or database solution to share user information across instances. This code snippet assumes a single server instance scenario.
    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
         onlineUsers.set(userId, socket.id);

      });

      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
      });
    });

    io.on('disconnect', (socket) => {
      // Handle Socket.IO server disconnection from a client
      console.log(`Server disconnected from a client`);

    });
  }
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection".toUpperCase(), ",Shutting down....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
