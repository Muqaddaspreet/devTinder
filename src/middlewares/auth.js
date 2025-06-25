const adminAuth = (req, res, next) => {
  // Handling Auth Middleware for all GET, POST, PATCH, DELETE, ... requests.
  console.log("Admin Auth is getting checked");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    // Logic of sneding back the error with appropriate status code.
    res.status(401).send("Unauthorized request!");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  // Handling Auth Middleware for all GET, POST, PATCH, DELETE, ... requests.
  console.log("User Auth is getting checked");
  const token = "abc";
  const isUserAuthorized = token === "xyz";
  if (!isUserAuthorized) {
    // Logic of sneding back the error with appropriate status code.
    res.status(401).send("Unauthorized request!");
  } else {
    next();
  }
};
module.exports = { adminAuth, userAuth };
