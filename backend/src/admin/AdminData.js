const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const isAdmin = require("./verifyAdmin");

router.post("/AdminDashboard", isAdmin, async (req, res) => {
  try {
    const userData = await prisma.book.findMany({
      // orderBy: { createdAt: "desc" }
    });
    console.log("admin");
    
    if (userData.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Here is all user data",
      users: userData,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}); 

router.post("/AdminUploadBook", isAdmin, async (req, res) => {
  try {
    const { title, author, ISBN, isAvailable } = req.body;
    const userId = req.userId; 

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const createbook = await prisma.book.create({
      data: {
        title,
        author,
        ISBN,
        isAvailable,
        buyerId: userId,
      }
    });

    return res.status(200).json({ message: "Book created successfully", createbook });
  } catch (error) {
    console.error("CreateShop error:", error);
    res.status(500).json({ message: "Server issue", error: error.message });
  }
});


module.exports = router;