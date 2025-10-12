require('module-alias/register')
require("dotenv").config({path:"../../../.env"})
const express = require("express");
const router = require("./config/index.routes");
const app = express();
const ADMIN_PORT = process.env.ADMIN_PORT || 5000;
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("../../../shared/middlewares/errorHandler");
const connectDB = require("../../config/db");
app.use(cors())
app.use(helmet())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/admin/v1/",router);
app.use(errorHandler)
app.listen(ADMIN_PORT, async() => {
    await connectDB()
    console.log(`Server Running On port : ${ADMIN_PORT}`)
})