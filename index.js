const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ test: "123" });
});

app.listen(2000, () => console.log(`http://localhost:2000/`));
