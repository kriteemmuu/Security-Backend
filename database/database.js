const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_LOCAL);
    console.log(
      `MongoDB is connected At:${connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Exporting the function
module.exports = connectDatabase;
//