const express = require("express");
const app = express();
const port = 3000;
const db = require("./database");
const { User } = require("./models/users");
const { Post } = require("./models/posts");

const initApp = async () => {
  console.log("Testing the database connection..");

  // Test the connection.
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    /**
     * Start the web server on the specified port.
     */
    app.get("/", async (req, res) => {
      //console.log(req);
      return res.send("hello world");
    });

    app.get("/usuarios", async (req, res) => {
      //console.log(req);
      const x = await User.findAll();
      return res.send(x);
    });

    app.get("/usuarios/:id", async (req, res) => {
      //console.log(req);
      const x = await User.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(x);
    });

    app.get("/publicaciones", async (req, res) => {
      const x = await Post.findAll();
      return res.send(x);
    });

    app.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.original);
  }
};

initApp();
