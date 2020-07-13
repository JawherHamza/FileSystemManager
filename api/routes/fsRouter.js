import express from "express";
const fsController = require("../controllers/fsController");

let router = express.Router();

router
  .post("/browse", fsController.browse)
  .get("/download", fsController.download)
  .post("/upload", fsController.upload)
  .post("/remove", fsController.remove);

module.exports = router;
