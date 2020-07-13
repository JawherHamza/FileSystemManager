const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const server = require("http").createServer(app);
const fsRouter = require("./routes/fsRouter");
const fileUpload = require("express-fileupload");
const PORT = process.env.API_PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({}));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());

app.use("/", fsRouter);

server.listen(PORT, () => {
  console.log("FS API Started", PORT);
});
