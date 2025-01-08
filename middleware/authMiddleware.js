const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const authenticateToken = (req,res,next) => {
    const token = req.headers["authorization"];

    if(!token) {
        return res.status(401).json({ message: "Access denied"});
    };

    try {
        const verified = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.user = verified;
        next();
    }catch(error) {
        res.status(403).json({message: "Invalid token"});
    }
};

module.exports = authenticateToken;