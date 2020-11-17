const { response } = require("express");
const http = require("http");
const app = require("express")();
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.listen(9091, () => console.log("Listening on http port 9091"));
const websockerServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"));

// hashmap
const clients = {};
const games = {};

const wsServer = new websockerServer({
  httpServer: httpServer,
});

wsServer.on("request", (request) => {
  // Client Connect
  const connection = request.accept(null, request.origin);
  connection.on("open", () => console.log("opened!"));
  connection.on("closed", () => console.log("closed!"));
  connection.on("message", (message) => {
    // Received a message from the client
    const result = JSON.parse(message.utf8Data);

    // Method CREATE
    if (result.method === "create") {
      const clientId = result.clientId;
      const gameId = guid();
      games[gameId] = {
        id: gameId,
        balls: 20,
        clients: [],
        state: {},
      };

      const payload = {
        method: "create",
        game: games[gameId],
      };
      const con = clients[clientId].connection;
      con.send(JSON.stringify(payload));
    }

    // Method JOIN
    if (result.method === "join") {
      const clientId = result.clientId;
      const gameId = result.gameId;
      const game = games[gameId];
      if (game.clients.length >= 3) {
        // Max player reached
        return;
      }
      const color = { 0: "Red", 1: "Green", 2: "Blue" }[game.clients.length];
      game.clients.push({
        clientId,
        color,
      });

      // Start the Game when first Player join
      if (game.clients.length === 1) updateGameState();
      const payload = {
        method: "join",
        game,
      };

      // tell al clients: player are joined
      game.clients.forEach((c) => {
        clients[c.clientId].connection.send(JSON.stringify(payload));
      });
    }

    // Method PLAY
    if (result.method === "play") {
      const clientId = result.clientId;
      const gameId = result.gameId;
      const ballId = result.ballId;
      const color = result.color;

      let state = games[gameId].state;
      if (!state) state = {};

      state[ballId] = color;
      games[gameId].state = state;
    }
  });

  //  Genarate a new ClientID
  const clientId = guid();
  clients[clientId] = {
    connection: connection,
  };

  const payload = {
    method: "connect",
    clientId: clientId,
  };
  // Send back the client connect
  connection.send(JSON.stringify(payload));
});

function updateGameState() {
  for (const g of Object.keys(games)) {
    const game = games[g];
    const payload = {
      method: "update",
      game,
    };

    game.clients.forEach((c) => {
      clients[c.clientId].connection.send(JSON.stringify(payload));
    });
  }

  setTimeout(updateGameState, 500);
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
const guid = () =>
  (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
