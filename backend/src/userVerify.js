const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("okok = ", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const rawToken = authHeader.split(" ")[1];
  const token = rawToken.replace(/^"|"$/g, "");
  console.log("token = ", token);


  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.user = { id: decoded.id, role: decoded.role };
    // req.borrowedID = decoded;
    // console.log("req.user = ", req.borrowedID ); 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;