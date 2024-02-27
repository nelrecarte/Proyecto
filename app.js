const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  //console.log(req);
  return res.send("Hello World!");
});

app.get("/usuarios", (req, res) => {
  let usuarios = {nombre: "Juan", edad: "21"};
  res.send(usuarios);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
