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

//Get all bears from the database
router.get("/", async (req, res) => {
  try {
    const bears = await db("bears");
    res.status(200).json(bears);
  } catch (error) {
    res
      .status(500)
      .json({ message: "The bears information could not be retrieved." });
  }
});

//Get bear by id request
router.get("/:id", async (req, res) => {
  try {
    const bear = await db("bears")
      .where({ id: req.params.id })
      .first();
    if (bear) {
      res.status(200).json(bear);
    } else {
      res
        .status(404)
        .json({ message: "The bear with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The bear information could not be retrieved." });
  }
});

// Create bear request
router.post("/", async (req, res) => {
  try {
    if (req.body.name) {
      const [id] = await db("bears").insert(req.body);
      const bear = await db("bears")
        .where({ id })
        .first();
      res.status(201).json(bear);
    } else {
      res.status(400).json({
        errorMessage: "Please provide the name for the bear."
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error while saving the bear to the database"
    });
  }
});

// Update bear request
router.put("/:id", async (req, res) => {
  try {
    const count = await db("bears")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const bear = await db("bears")
        .where({ id: req.params.id })
        .first();
      res.status(200).json(bear);
    } else {
      res
        .status(404)
        .json({ message: "The bear with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The bear information could not be modified." });
  }
});

//delete zoos request
router.delete("/:id", async (req, res) => {
  try {
    const count = await db("bears")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res
        .status(404)
        .json({ message: "The bear with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ message: "The bear could not be deleted" });
  }
});

module.exports = router;
