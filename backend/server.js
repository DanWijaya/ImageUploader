require("dotenv").config({ path: "../.env" });
const express = require("express");
const bodyParser = require("body-parser");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { uploadFile, getFileStream, deleteFileStream } = require("./s3");
const { insertItem, getAllPublicItem, deleteItem } = require("./dynamodb");

const app = express();

// Bodyparser middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // for parsing application/json
app.use(express.json());
app.use(bodyParser.json());

app.get("/images/:key", (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

app.get("/getimages/all", async (req, res) => {
  try {
    const images = await getAllPublicItem();
    res.send(images.Items);
  } catch (err) {
    console.log("Error occured");
    res.status(400).send({ message: "Error occured" });
  }
  // console.log(images);
  // var allImagePath = images.Items?.map((item) => item.key);
  // res.send({ allImagePath: allImagePath });
});

app.post("/imagesWithDesc", upload.single("image"), async (req, res) => {
  const file = req.file;
  console.log("Is Public: ", req.query);
  try {
    const s3File = await uploadFile(file);
    console.log(s3File.Key, req.query.isPublic, req.query.description);
    const item = await insertItem({
      fileKey: s3File.Key,
      isPublic: req.query.isPublic == "true",
      description: req.query.description,
    });
    res.send({ imagePath: `${s3File.Key}`, description: req.query.description });
  } catch (err) {
    console.error("Error: ", err);
    res.status(400).send({ message: "Error occured" });
  }
});

app.delete("/deleteImage/:fileKey", async (req, res) => {
  const fileKey = req.params.fileKey;
  console.log(fileKey);
  try {
    await deleteItem(fileKey);
    await deleteFileStream(fileKey);
    console.log("Image deleted successfully");
    res.send({ message: "Image Deleted successfully" });
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

app.listen(8080, () => console.log("listening on port 8080"));
