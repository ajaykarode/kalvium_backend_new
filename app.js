const express = require("express");
const app = express();
const fs = require("fs");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let log = [];




app.get("/*", (req, res) => {
  const expr = req.originalUrl;
  const urlParam = expr
    .replace(/plus/g, "+")
    .replace(/minus/g, "-")
    .replace(/into/g, "*")
    .replace(/remainder/g, "%");


  const q = urlParam.replace(/\//g, "");

  try {
    const ans = eval(q);
    if (isNaN(ans)) {
      res
        .status(400)
        .json({ error: "Given mathematical expression is invalid" });
    } else {
      log.unshift({ question: q, answer: ans });
      log = log.slice(0, 20);

      fs.appendFile(
        "historyData.txt",
        JSON.stringify({ userQuery: q, calculatedResult: ans }) + "\n",
        (error) => {
          if (error) {
            console.error("Error while writing: ", error);
          }
        }
      );

      res.json({ question: q, answer: ans });
    }
  } catch (error) {
    res.status(400).json({ error: "Given mathematical expression is invalid" });
  }
});

app.get("/history", (req, res) => {
  fs.readFile("historyData.txt", "utf8", (error, content) => {
    if (error) {
      console.error("Error while reading history data: ", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const newLine = content.trim().split("\n");
      const parsedLogData = newLine.map((line) => JSON.parse(line));

      const last20entries = parsedLogData.slice(0, 20);
      res.json(last20entries);
    }
  });
});

module.exports = app;


