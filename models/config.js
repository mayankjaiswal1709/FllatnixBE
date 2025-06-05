const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.URl;

if (!mongoURI) {
  console.error("MONGODB URL is not defined in environment variables.");
  process.exit(1); 
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("mongoDb is connected");
});

mongoose.connection.on("error", (err) => {
  console.log("mongoDb connection error", err);
});
