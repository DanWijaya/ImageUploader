require("dotenv").config({ path: "../.env" });
const express = require("express");
const bodyParser = require("body-parser");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { uploadFile, getFileStream } = require("./s3");
const { insertItem, getAllPublicItem } = require("./dynamodb");

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
  const images = await getAllPublicItem();
  res.send(images.Items);
  // console.log(images);
  // var allImagePath = images.Items?.map((item) => item.key);
  // res.send({ allImagePath: allImagePath });
});

app.post("/imagesWithDesc", upload.single("image"), async (req, res) => {
  const file = req.file;
  console.log("Is Public: ", req.query);
  try {
    const s3File = await uploadFile(file);
    const item = await insertItem({
      fileKey: s3File.Key,
      isPublic: req.query.isPublic == "true",
      description: req.query.description,
    });
    res.send({ imagePath: `${s3File.Key}`, description: req.query.description });
  } catch (err) {
    console.error("Error: ", err);
  }
});

app.listen(8080, () => console.log("listening on port 8080"));
