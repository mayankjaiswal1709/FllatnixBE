const express = require("express");
const csvdata = express();
// Multer section
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

csvdata.use(bodyParser.urlencoded({ extended: true }));
csvdata.use(express.static(path.resolve(__dirname, "public")));

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });
// end  multer section
const dataController = require("../controllers/DataController");

csvdata.post(
  "/importcsvdata",
  upload.single("file"),
  dataController.importData
);
csvdata.get("/getuploadeddata", dataController.getImportedData);

module.exports = csvdata;
