const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

// REgister

router.post("/register", async (req,res) => {
    try {
        const {username, email, password} = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({username, email, password: hashedPassword});
        await newUser.save();
        res.status(201).json({message: "USer registered successfully!!!"})

    }catch(error) {
        res.status(500).json({message: "Registration error", error});
    }
});



router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login Request:", { email, password }); 
  
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Invalid password");
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ userID: user._id }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      console.error("Error login:", error); 
      res.status(500).json({ message: "Error login", error });
    }
  });
  

router.get("/users", authenticateToken, async (req,res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    }catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

module.exports = router;