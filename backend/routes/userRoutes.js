const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const validateRegister = require("../validation/register");
const validateLogin = require("../validation/login");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  const { isValid, errors } = validateRegister(req.body);
  if (!isValid) {
    return res.status(404).json(errors);
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.email = "Email already registerd";
        return res.status(400).json(errors);
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: hash,
          });
          newUser
            .save()
            .then((newUser) => res.json(newUser))
            .catch((err) => console.log(err));
        });
      });
    })
    .catch((errors) => console.log(errors));
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) {
    return res.status(401).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then((isMatch) => {
        if (isMatch) {
          const token = jwt.sign(
            { id: user._id },
            process.env.SECRET,
            { expiresIn: "1d" },
            (err, token) => {
              return res.json({
                message: "Login Successful",
                token: token,
              });
            }
          );
          res.header("auth-header", token);
        } else res.status(401).json({ message: "Incorrect Password" });
      });
    } else {
      return res.status(401).json({ message: "email is not registered" });
    }
  });
});

module.exports = router;
