const express = require("express");
const app = express();
const port = 3000;
const db = require("./database");
const { User } = require("./models/users");
const { Post } = require("./models/posts");

const initApp = async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
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

    app.post("/usuarios", async (req, res) => {
      //Create a new user
      try {
        const result = await User.create({
          nombre: req.body.nombre,
          edad: req.body.edad,
          correo: req.body.correo,
          carrera: req.body.carrera,
          num_cuenta: req.body.num_cuenta,
          password: req.body.password,
        });
        res.send(result);
      } catch (err) {
        res.status(400);
        res.send(err);
      }
      //by this point, the user has been saved to the database!
    });

    app.put("/usuarios", async (req, res) => {
      try {
        const toUpdate = await User.findOne({
          where: {
            id: req.body.id,
          },
        });
        const result = await toUpdate.update({
          nombre: req.body.nombre,
          edad: req.body.edad,
          correo: req.body.correo,
          carrera: req.body.carrera,
          num_cuenta: req.body.num_cuenta,
          password: req.body.password,
        });
        res.send(result);
      } catch (error) {
        res.status(400);
        res.send(error);
      }
    });

    app.delete("/usuarios", async (req, res) => {
      try {
        const toDelete = await User.findOne({
          where: {
            id: req.body.id,
          },
        });
        const result = await toDelete.destroy();
        res.send(result);
      } catch (error) {
        res.status(400);
        res.send(error);
      }
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
