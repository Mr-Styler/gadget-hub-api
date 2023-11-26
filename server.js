require("dotenv").config({ path: "./config.env" });
const server = require("./app");
const session = require("express-session");
const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI || "mongodb://localhost/Walmart";

mongoose
  .connect(DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5555;
session.PORT = PORT;

server.listen(PORT, () =>
  console.log(`Server is running on localhost:${PORT}`)
);
