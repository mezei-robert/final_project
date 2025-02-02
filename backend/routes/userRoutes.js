const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMiddleware');
const User = require('../model/User');
const router = express.Router();

//Teszteljuk a vedelem mukodeset
router.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({ message: "You have access!", user: req.user });
});

//Felhasznalok regisztralasa
router.post('/register', async (req, res) => {
  try {
    const {username, email, password} = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists!" });
    }

    saltRounds = 10; //ennyiszer futassa le a hashellest
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({username, email, password: hashedPassword});
    await newUser.save();
    res.status(201).json({message: 'Registration successful'});
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).json({message: error.message});
  }
});

//Felhasznalok bejelentkezese
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //Felhasznalot email alapjan keressuk
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        //jelszo ellenorzese
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password!" });
        }

        //token generalasa
        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({ message: "Login successful!", user, token });
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).json({ message: error.message });
    }
});

//Felhasznalok lekerdezese
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;