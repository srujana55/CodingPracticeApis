const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

initializeDBAndServer();
app.listen(3000, () => {
  console.log("Server Running");
});

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

//get players
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team;`;
  const playersArray = await database.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

// create player
app.post("/players/", async (request, response) => {
  const PlayerDetails = request.body;
  const { playerName, jerseyNum, role } = PlayerDetails;
  const addPlayer = `
  INSERT INTO cricket_team(playerName,jerseyNum,role)
  VALUES (
      ${playerName},
      ${jerseyNum},
      ${role}
  );

  `;
  await dn.run(addPlayer);

  response.send("Player Added to Team");
});

//get player based on id
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `
  SELECT * FROM cricket_team WHERE 
  playerId=${playerId}; 
  `;
  const player = await db.get(getPlayer);
  response.send(player);
});

//put update player
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateplayer = `
    UPDATE cricket_team SET 
    playerName=${playerName},
    jerseyNumber=${jerseyNumber},
    role=${role}
    where playerId=${playerId};`;
  await db.run(updateplayer);
  response.send("Player Details Updated");
});
//delete player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `
    DELETE FROM cricket_team player_id =${playerId};
    `;
  await db.run(deletePlayer);
  response.send("Player Removed");
});
