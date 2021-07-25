const express = require("express");
const cors = require('cors');
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const imaps = require('imap-simple');

const PORT = process.env.PORT || 4001;

let IMAPconnection;
let unread;
let ActiveSocket;

const app = express();
app.use(cors());
app.options('*', cors());
app.use(index);

const getUnread = () => {
  IMAPconnection.openBox('INBOX').then(() => {
    const searchCriteria = ['UNSEEN'];

    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false,
    };

    return IMAPconnection.search(searchCriteria, fetchOptions).then((results) => {
      unread = results.length;
      if (ActiveSocket) ActiveSocket.emit("FromAPI", unread);
    });
  });
}

const config = {
  imap: {
    user: 'josh@dotblack.io',
    password: '123123234_Jj',
    host: 'imappro.zoho.eu',
    port: 993,
    tls: true,
    authTimeout: 3000,
  },
  onmail: () => getUnread(),
  onupdate: () => getUnread(),
};

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' },
});

io.on("connection", (socket) => {
  ActiveSocket = socket;
  getUnread();
  socket.on("disconnect", () => { ActiveSocket = undefined });
});

server.listen(PORT, () => {
  imaps.connect(config).then(function (connection) {
    IMAPconnection = connection;
    getUnread();
  });
  console.log(`Listening on port ${PORT}`);
});