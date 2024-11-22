const express = require("express");
const router = require("./routes");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/payU", router);

const Port = 5000;
app.listen(Port, () => console.log(`Server running on port ${Port}`));
