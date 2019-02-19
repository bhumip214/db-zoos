const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

//Get all zoos from the database
server.get("/api/zoos", async (req, res) => {
  try {
    const zoos = await db("zoos");
    res.status(200).json(zoos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "The zoos information could not be retrieved." });
  }
});

//Get zoo by id
server.get("/api/zoos/:id", async (req, res) => {
  try {
    if (zoo) {
      const zoo = await db("zoos")
        .where({ id: req.params.id })
        .first();
      res.status(200).json(zoo);
    } else {
      res
        .status(404)
        .json({ message: "The zoo with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The zoo information could not be retrieved." });
  }
});

// Create zoos
server.post("/api/zoos", async (req, res) => {
  try {
    if (req.body.name) {
      const [id] = await db("zoos").insert(req.body);
      const zoo = await db("zoos")
        .where({ id })
        .first();
      res.status(201).json(zoo);
    } else {
      res.status(400).json({
        errorMessage: "Please provide the name for the zoo."
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "There was an error while saving the zoo to the database"
      });
  }
});

// Update zoo
server.put("/api/zoos/:id", async (req, res) => {
  try {
    const count = await db("zoos")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const zoo = await db("zoos")
        .where({ id: req.params.id })
        .first();
      res.status(200).json(zoo);
    } else {
      res
        .status(404)
        .json({ message: "The zoo with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The post information could not be modified." });
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
