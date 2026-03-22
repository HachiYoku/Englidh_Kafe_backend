const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const [scheme, token] = authHeader.trim().split(/\s+/);

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Authorization header must be in the format: Bearer <token>",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(401).json({ message: "User is not authorized!" });
  }
};

module.exports = validateToken;
