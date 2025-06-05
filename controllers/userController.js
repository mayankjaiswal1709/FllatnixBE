const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { email, password, name, age } = req.body;

    if (!email || !password || !name || !age) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "User already exists, please sign in" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email,
      password: hashPass,
      name,
      age,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, age: newUser.age },
      process.env.JWT,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Signup successful",
      result: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        age: newUser.age,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const requiredUser = await UserModel.findOne({ email });
    if (!requiredUser) {
      return res
        .status(404)
        .json({ message: "No user with this email exists, please sign up" });
    }

    const passwordMatch = await bcrypt.compare(password, requiredUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: requiredUser._id, age: requiredUser.age },
      process.env.JWT,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successfully",
      result: {
        _id: requiredUser._id,
        email: requiredUser.email,
        name: requiredUser.name,
        age: requiredUser.age,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { signup, login };
