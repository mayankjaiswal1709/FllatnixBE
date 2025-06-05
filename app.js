const express =require("express");
require('dotenv').config()
const app = express();
app.use(express.json()); 
require('./models/config')
let  dataRoute = require('./routes/dataRoutes');
let  userRoute = require('./routes/userRoutes')


const cors = require("cors");

app.use(cors());
app.use('/',dataRoute);
app.use('/',userRoute)




app.listen(process.env.PORT, (req, res) => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
  