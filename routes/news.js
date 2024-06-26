var express = require("express");
var router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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


router.post("/news", async (req, res) => {
  const { headline, summary, youtube } = req.body;
  const author = "Ladi Patrick";

  let image = null;

  // Upload image if present
  if (req.files && req.files.image) {
    try {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          folder: "news_images", // Optional: folder name in Cloudinary
        }
      );
      image = result.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      return res.status(500).json({ error: "Error uploading image" });
    }
  }

  try {
    await req.db("custom_news").insert({
      headline,
      summary,
      image,
      youtube,
      author,
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
