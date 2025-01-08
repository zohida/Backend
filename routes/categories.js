const express = require("express");
const multer = require("multer");
const Category = require("../models/Category");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    const updatedCategories = categories.map((category) => ({
      ...category._doc,
      image: `${req.protocol}://${req.get("host")}/${category.image}`,
    }));
    res.json(updatedCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : null;

    const newCategory = new Category({ name, image });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put("/:id", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, ...(image && { image }) },
      { new: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted", deletedCategory });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
