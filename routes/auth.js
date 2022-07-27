const router = require("express").Router();
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong Credentials");
    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );
    const pass = hashedPassword.toString(CryptoJs.enc.Utf8);
    pass !== req.body.password && res.status(401).json("Wrong Credentials");

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    const { password, ...rest } = user._doc;
    res.status(200).json({ ...rest, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
