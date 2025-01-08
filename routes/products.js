const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    const updatedProducts = products.map((product) => {
      const productImage = product.image
        ? `${req.protocol}://${req.get("host")}/${product.image.replace(/\\/g, "/")}`
        : `${req.protocol}://${req.get("host")}/uploads/default-product.png`;

      const categoryImage = product.category?.image
        ? `${req.protocol}://${req.get("host")}/${product.category.image.replace(/\\/g, "/")}`
        : `${req.protocol}://${req.get("host")}/uploads/default-category.png`;

      return {
        ...product._doc,
        image: productImage,
        category: {
          ...product.category?._doc,
          image: categoryImage,
        },
      };
    });

    res.json({
      products: updatedProducts,
      total: updatedProducts.length,
      page: 1,
      limit: 10,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});





router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.path : null;

    const newProduct = new Product({ name, description, price, category, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.put("/:id", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, ...(image && { image }) },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted", deletedProduct });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
