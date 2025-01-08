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

let url = "mongodb+srv://zohishka04:omqScYUksU8T9pA6@crud.mntdg.mongodb.net/?retryWrites=true&w=majority&appName=crud";

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