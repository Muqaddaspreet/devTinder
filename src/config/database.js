const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://muqaddaspreet:FO1mRfzAzkThmJf5@firstnode.zltspbx.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
