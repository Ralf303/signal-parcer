import express from "express";
import fs from "fs";

export const start = async () => {
  const app = express();

  app.use(express.json());

  app.post("/", (req, res) => {
    console.log(req);

    const data = JSON.stringify(req.body, null, 2);
    fs.writeFile(`request_${Date.now()}.txt`, data, (err) => {
      if (err) {
        return res.status(500).send("Error writing file");
      }
      res.send("Data saved!");
    });
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};
