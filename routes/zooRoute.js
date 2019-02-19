const express = require("express");

const router = express.Router();

const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);

router.use(express.json());

// endpoints here

//Get all zoos from the database
router.get("/", async (req, res) => {
  try {
    const zoos = await db("zoos");
    res.status(200).json(zoos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "The zoos information could not be retrieved." });
  }
});

//Get zoo by id request
router.get("/:id", async (req, res) => {
  try {
    const zoo = await db("zoos")
      .where({ id: req.params.id })
      .first();
    if (zoo) {
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

// Create zoos request
router.post("/", async (req, res) => {
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
    res.status(500).json({
      message: "There was an error while saving the zoo to the database"
    });
  }
});

// Update zoo request
router.put("/:id", async (req, res) => {
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

//delete zoos request
router.delete("/:id", async (req, res) => {
  try {
    const count = await db("zoos")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res
        .status(404)
        .json({ message: "The zoo with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ message: "The zoo could not be deleted" });
  }
});

module.exports = router;
