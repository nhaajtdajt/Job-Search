const express = require("express");

const app = express();

const hostname = "localhost";
const port = 8017;

app.get("/", (req, res) => {
  // Test Absolute import mapOrder
  // eslint-disable-next-line no-console

  res.end("<h1>Hello World!</h1><hr>");
});

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Hello Hoang Usuk Dev, I am running at http://${hostname}:${port}/`
  );
});
