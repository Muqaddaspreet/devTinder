const mongoose = require("mongoose");

const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      validate(value) {
        // Custom validator function
        if (!validator.isEmail(value)) {
          throw new Error("Email adress invalid " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(" sorry Enter a strong password " + value);
        }
      },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url " + value);
        }
      },
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

userSchema.methods.getJWT = async function () {
  // Create a JWT token
  const user = this;
  const token = jwt.sign({ _id: user._id }, "DEV@TINDER$2000", {
    expiresIn: "365d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  // Compare the passwordInputByUser with the passwordHash stored in the database.
  // Return true if they match, false otherwise.
  // We will use bcrypt.compare() method for this.
  const isPasswordMatch = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordMatch;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
