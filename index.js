const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "/frontUI")));
app.use(express.static(path.join(__dirname, "/logic")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontUI", "draughts.html"));
});
app.listen(port, () => {
  console.log(` app listening at http://localhost:${port}`);
});
