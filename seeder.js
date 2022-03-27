const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//Load env variables
dotenv.config({ path: "./config/config.env" });

const Course = require("./models/Course");
// const Student = require('./models/Student');
const Grade = require("./models/Grade");
const User = require("./functions/src/models/User");

//Connect to the db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//ReadJSON files
// const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
// const students = JSON.parse(fs.readFileSync(`${__dirname}/_data/students.json`, 'utf-8'));
const grades = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/grades.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

//Import into DB
const importData = async () => {
  try {
    // await Bootcamp.create(bootcamps);
    await Course.create(courses);
    // await Student.create(students);
    await Grade.create(grades);
    await User.create(users);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
//delete data
const deleteData = async () => {
  try {
    // await Bootcamp.deleteMany();
    await Course.deleteMany();
    // await Student.deleteMany();
    await Grade.deleteMany();
    await User.deleteMany();

    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
