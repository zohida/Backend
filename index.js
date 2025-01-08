require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const AuthRouter = require("./routes/auth");
const CategoryRouter = require("./routes/categories");
const ProductRouter = require("./routes/products");


const app = express();

app.use(express.json());
app.use(cors());
app.use("uploads", express.static(path.join(__dirname, "/uploads")));

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


const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});