const express = require("express");
const app = express();
const port = 3001;
const db = require("./database");
const { User } = require("./models/users");
const { Post } = require("./models/posts");
const { Friend } = require("./models/friends");
const cors = require("cors");
app.use(cors());
const { QueryTypes } = require("sequelize");
const sequelize = require("./database");

const initApp = async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  console.log("Testing the database connection..");

  // Test the connection.
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    // Database Relationships

    User.hasMany(Post, {
      foreignKey: "user_id",
    });

    // User.belongsToMany(User, {
    //   as: "friends",
    //   // foreignKey: 'UserID1',
    //   through: Friend,
    // });

    // User.belongsToMany(User, {
    //   as: "userFriends",
    //   // foreignKey: 'UserID2',
    //   through: Friend,
    // });

    app.get("/", async (req, res) => {
      //console.log(req);
      return res.send("hello world");
    });

    //API Usuarios

    app.get("/usuarios", async (req, res) => {
      //console.log(req);
      const x = await User.findAll({
        include: [{ model: Post, as: "publicaciones" }],
      });
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

    //API publicaciones

    app.get("/publicaciones", async (req, res) => {
      const x = await Post.findAll();
      return res.send(x);
    });

    app.get("/publicaciones/:id", async (req, res) => {
      const x = await Post.findAll({
        where: {
          user_id: req.params.id,
        },
      });
      return res.send(x);
    });

    app.post("/publicaciones", async (req, res) => {
      try {
        const result = await Post.create({
          user_id: req.body.id,
          texto: req.body.texto,
        });
        res.send(result);
      } catch (err) {
        res.status(400);
        res.send(err);
      }
    });

    app.put("/publicaciones", async (req, res) => {
      try {
        const toUpdate = await Post.findOne({
          where: {
            user_id: req.body.id,
          },
        });
        const result = await toUpdate.update({
          texto: req.body.texto,
        });
        res.send(result);
      } catch (err) {
        res.status(400);
        res.send(err);
      }
    });

    app.delete("/publicaciones/:id", async (req, res) => {
      try {
        const toDelete = await Post.findOne({
          where: {
            id: req.params.id,
          },
        });
        const result = await toDelete.destroy();
        res.send(result);
      } catch (err) {
        res.status(400);
        res.send(err);
      }
    });

    // GET PUBLICACIONES DE AMIGOS EN EL FEED
    app.get("/feed/:id", async (req, res) => {
      try {
        const user_id = req.params.id;
        const query = `
        SELECT 
          amigos.UserID1,
          amigos.UserID2,
          amigos.id as friendship_id,
          publicaciones.id as post_id,
          publicaciones.texto as texto,
          publicaciones.user_id  as user_id,
          usuarios.nombre  as name
      FROM amigos AS amigos 
      LEFT OUTER JOIN publicaciones AS publicaciones ON amigos.UserID2 = publicaciones.user_id 
      LEFT OUTER JOIN usuarios AS usuarios ON usuarios.id = publicaciones.user_id
      WHERE 
        amigos.UserID1 = '${user_id}' 
      and
        texto is not null;`;

        const result = await sequelize.query(query, {
          type: QueryTypes.SELECT,
        });

        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(400);
        res.send(err);
      }
    });

    // API AMIGOS

    // app.get('/amigos', async (req, res) => {
    //   const x = await Friend.findAll({
    //     include: [{model: User, as: 'usuarios' }],
    //   });
    //   return res.send
    // });

    app.get("/amigos/:id", async (req, res) => {
      try {
        const user_id = req.params.id;
        const query = `
        SELECT 
          amigos.UserID2
        FROM amigos AS amigos  
        WHERE amigos.UserID1 = '${user_id}'`;

        const id2 = await sequelize.query(query, {
          type: QueryTypes.SELECT,
        });

        const userIds = id2.map((idObj) => idObj.UserID2);

        const result = await User.findAll({
          where: {
            id: userIds,
          },
        });

        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(400);
        res.send(err);
      }
    });

    app.post("/amigos", async (req, res) => {
      try {
        const amigoToAdd = await User.findOne({
          where: {
            correo: req.body.correo,
          },
        });

        if (!amigoToAdd) {
          // Handle case where amigo is not found
          res.status(404).json({ error: "Amigo not found" });
          return;
        }

        const result1 = await Friend.create({
          UserID1: req.body.UserID1,
          UserID2: amigoToAdd.id,
        });

        const result2 = await Friend.create({
          UserID1: amigoToAdd.id,
          UserID2: req.body.UserID1,
        });

        // Send a success response with the created friend relationships
        res.status(201).json({ result1, result2 });
      } catch (error) {
        // Handle other errors
        console.error("Error adding friend: ", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    /**
     * Start the web server on the specified port.
     */

    app.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });

    app.post("/login", async (req, res) => {
      const { correo, password } = req.body;

      try {
        const user = await User.findOne({ where: { correo } });

        if (!user || user.password !== password) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        //res.json({ message: "Login successful" });
        res.send({ user, message: "login succesful" });
      } catch (error) {
        console.error("Error during login", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

//

initApp();
