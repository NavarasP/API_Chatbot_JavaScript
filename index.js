import * as dotenv from "dotenv";
const express = require("express");
const home = require("./routes/api");


dotenv.config();
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api",api);



app.listen(8000, () => {
    console.log( "server running ....");
  });