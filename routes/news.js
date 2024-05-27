var express = require('express');
var router = express.Router();
const multer = require("multer");
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Specify the directory for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});
const upload = multer({ storage: storage });
const path = require("path");


/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const newsEntries = await req.db("custom_news").select("*");
    res.json(newsEntries);
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ error: "Error fetching news" });
  }
});


router.post("/news", upload.single("image"), async (req, res) => {
  const { headline, summary, youtube } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const author = "KingDavid"

  try {
    await req.db("custom_news").insert({
      headline,
      summary,
      image,
      youtube,
      author
    });

    res.status(200).json({ message: "News added successfully" });
  } catch (error) {
    console.error("Error adding news:", error.message);
    res.status(500).json({ error: "Error adding news" });
  }
});

router.get("/home", function (req, res, next) {
  res.send("welcome o");
});

module.exports = router;
