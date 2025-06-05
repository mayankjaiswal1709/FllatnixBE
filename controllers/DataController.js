const user  = require("../models/dataModel")
const jwt = require("jsonwebtoken");
const  csv = require('csvtojson')
const fs = require("fs");

// for adding data into db 
const importData = async (req, res) => {
  try {
    const userData = [];

    // Parse the CSV file into JSON
    const response = await csv().fromFile(req.file.path);

    if (response.length > 0) {
      for (let x = 0; x < response.length; x++) {
        userData.push({
          show_id: response[x].show_id,
          type: response[x].type,
          title: response[x].title,
          director: response[x].director,
          cast: response[x].cast,
          country: response[x].country,
          date_added: response[x].date_added,
          release_year: response[x].release_year,
          rating: response[x].rating,
          duration: response[x].duration,
          listed_in: response[x].listed_in,
          description: response[x].description,
        });
      }

      await user.insertMany(userData);

      fs.unlinkSync(req.file.path);

      return res.status(200).send({
        status: 200,
        success: true,
        msg: "You have successfully uploaded your data to the database",
      });
    } else {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);

      return res.status(400).send({
        status: 400,
        success: false,
        msg: "CSV file is empty or has no valid data.",
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      success: false,
      msg: error.message,
    });
  }
};

// Here we get all data from mongoDb 

const getImportedData = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const checktoken = jwt.verify(token, process.env.JWT);
    const userAge = checktoken.age;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const startIndex = (page - 1) * limit;

    const agerestrction = userAge < 18 ? { rating: { $ne: "R" } } : {};

    const count = await user.countDocuments(agerestrction);

    const showAllData = await user.aggregate([
      { $match: agerestrction },
      {
        $addFields: {
          show_id_number: {
            $toInt: { $substr: ["$show_id", 1, -1] },
          },
        },
      },
      { $sort: { show_id_number: 1 } },
      { $skip: startIndex },
      { $limit: limit },
    ]);

    if (showAllData.length > 0) {
      return res.status(200).json({
        status: true,
        importedData: showAllData,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No data found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};




module.exports = {
  importData,
  getImportedData,
};