const jwt = require("jsonwebtoken");

function isAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const rawToken = authHeader.split(" ")[1];
  const token = rawToken.replace(/^"|"$/g, "");

  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    console.log("decode: ", decoded);
    
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    req.userId = decoded.id; 
    console.log("req.userid", req.userId);
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = isAdmin;