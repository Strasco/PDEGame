const mongoose = require("mongoose");
const slugify = require("slugify");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    slug: String,
    study: {
      type: String,
      enum: ["MG", "MD", "MV"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

StudentSchema.pre("remove", async function (next) {
  console.log(`Grades being removed from Student ${this._id}`);
  await this.model("Grade").deleteMany({ student: this._id });
  next();
});

//Reverse Populate with virtuals
StudentSchema.virtual("grades", {
  ref: "Grade",
  localField: "_id",
  foreignField: "student",
  justOne: false,
});
module.exports = mongoose.model("Student", StudentSchema);
