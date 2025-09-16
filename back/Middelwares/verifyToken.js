const jwt = require("jsonwebtoken");

// Verify token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// Verify admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not an administrator!" });
    }
  });
};

// Verify same user
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "You are not this user!" });
    }
  });
};

// Verify admin or same user
const verifyAdminOrUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin || req.user._id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized!" });
    }
  });
};

module.exports = { verifyToken, verifyAdmin, verifyUser, verifyAdminOrUser };
