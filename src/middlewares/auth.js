const jwt = require("jsonwebtoken");
const User = require("../models/user");

// const adminAuth = (req, res, next) => {
//   // Handling Auth Middleware for all GET, POST, PATCH, DELETE, ... requests.
//   console.log("Admin Auth is getting checked");
//   const token = "xyz";
//   const isAdminAuthorized = token === "xyz";
//   if (!isAdminAuthorized) {
//     // Logic of sneding back the error with appropriate status code.
//     res.status(401).send("Unauthorized request!");
//   } else {
//     next();
//   }
// };

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookies.
    const { session_token } = req.cookies;
    if (!session_token) {
      throw new Error("Token not found");
    }
    // Validate the token.
    const decodedObj = jwt.verify(session_token, "DEV@TINDER$2000");
    if (!decodedObj) {
      throw new Error("Invalid token");
    }

    // Find the user from the database using the id in the token.
    const user = await User.findById(decodedObj._id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach the user object to the request for further use.
    next();
  } catch (err) {
    return res.status(401).send("ERROR: " + err.message);
  }
};
module.exports = { /*adminAuth,*/ userAuth };
