const validator = require("validator");

// Function to validate sign-up data

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required.");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name must be between 4 and 50 characters.");
  } else if (lastName.length < 4 || lastName.length > 50) {
    throw new Error("Last name must be between 4 and 50 characters.");
  } else if (!email || !validator.isEmail(email)) {
    throw new Error("A valid email is required.");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol."
    );
  }
};

const validateProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    /*"email",*/
    "photoUrl",
    "gender",
    "age",
    "skills",
    "about",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isUpdateAllowed;
};

module.exports = { validateSignUpData, validateProfileData };
