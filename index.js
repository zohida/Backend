require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const AuthRouter = require("./routes/auth");
const CategoryRouter = require("./routes/categories");
const ProductRouter = require("./routes/products");


const app = express();

app.use(express.json());
const allowedOrigins = [
    "https://keen-beignet-269c7b.netlify.app", 
    "https://bejewelled-marzipan-8d98f0.netlify.app", 
    "http://127.0.0.1:5500"
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

let url = process.env.MONGO_URI;

mongoose
.connect(url)
.then(() => console.log("MongoDb connected"))
.catch((err) => {
    console.log("Error", err) 
});

app.use("/api/auth", AuthRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/products", ProductRouter);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname), 
});
const upload = multer({ storage });
  
  
app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  });


const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
});