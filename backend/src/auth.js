require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const tokenverify = require("./userVerify");
const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(express.json());


router.get("/check", tokenverify, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/Signup", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username, 
        email, 
        password: hashedPassword,
        role: role === "ADMIN" ? "ADMIN" : "USER"
      }
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.TOKEN, { expiresIn: "1h" });
    return res.status(200).json({
      message: "Signup successful",
      user: { username, email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await prisma.user.findUnique({ where: { email } });
    if (!userData) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: userData.id, role: userData.role }, process.env.TOKEN, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: userData.id,
        name: userData.username,
        email: userData.email,
        role: userData.role
      }, token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server issue" });
  }
});

router.post("/fetchbooks", tokenverify, async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    if (books.length == 0) {
      return res.status(404).json({ message: "no books avilable" });
    }
    else {
      return res.status(200).json({ message: "here all book list", books })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
})

router.put("/markAsSold", tokenverify, async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        isAvailable: false,
        buyerId: userId,
      },
    });

    res.status(200).json({ message: "Book purchased", book: updatedBook });
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/returnbook", tokenverify, async (req, res) => {
  const { bookId } = req.body;

  try {
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        isAvailable: true,
        buyerId: null,
      },
    });

    res.status(200).json({ message: "Book returned", book: updatedBook });
  } catch (error) {
    console.error("Return error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/mybooks", tokenverify, async (req, res) => {
  const userId = req.user.id;

  try {
    const books = await prisma.book.findMany({
      where: { buyerId: userId },
    });

    res.status(200).json({ books });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;