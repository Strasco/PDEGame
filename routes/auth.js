const express = require("express");
const { register, login, getMe } = require("../controllers/auth");

const router = express.Router();
const User = require("../models/User");

const { protect } = require("../Middleware/auth");
const advancedResults = require("../Middleware/advancedResult");

const populate = {
  //this should not be here  !!!
  select: "-_id",
  path: "grades",
  model: "Grade",
  select: "grade -student -_id",
  populate: {
    path: "course",
    model: "Course",
    select: "title -_id",
  },
};

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, advancedResults(User, populate), getMe);

module.exports = router;
