const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // Makes it a required field
      minLength: 3, // min. 3 characters allowed
      maxLength: 100, // max. 100 characters allowed
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // This will be unique for each user
      lowercase: true,
      trim: true, // This will trim starting and trailing spaces
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        // Custom validator function
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpY5LtQ47cqncKMYWucFP41NtJvXU06-tnQ&s",
    },
    about: {
      type: String,
      default: " This is the default description of the user!",
    },
    skills: {
      type: [String], // This field will be an array of Strings
    },
  },
  {
    timestamps: true, // To store the time when a User is created first and added to the database
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
