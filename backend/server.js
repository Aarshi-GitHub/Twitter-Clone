const express = require("express");
require("dotenv").config();
const app = express();
const { json } = require("express");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const passport = require("passport");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.status(200).json({ messgae: "Tweet Like Bird" });
});

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
