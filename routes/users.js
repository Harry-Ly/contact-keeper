const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

// @route    POST api/users
// @desc     Register a user
// @access   Public
router.post(
  "/",
  // Checks for parameters and has error messages ready to be displayed when necessary (Express Validator)
  [
    check("name", "Please add name")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  // Displays array of errors if there are any
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      // If the user doesn't exist, create a new User. Not saved, just a new instance.
      user = new User({
        name,
        email,
        password
      });

      // Encrypts password/hash password with bcrypt before saving it to database
      // Salt is needed to encrypt the password
      const salt = await bcrypt.genSalt(10);

      // Uses salt to hash the password
      user.password = await bcrypt.hash(password, salt);

      // Saves to database
      await user.save();

      // Object to send in token
      const payload = {
        user: {
          id: user.id
        }
      };

      // To generate a token, you need to sign it
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
