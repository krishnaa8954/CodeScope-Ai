const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);

        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided"
            });
        }

        const token = authHeader.replace("Bearer ", "").trim();
        console.log("TOKEN =", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = authMiddleware;