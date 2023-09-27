require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const cors = require('cors');
const { sendSuccessResponse, sendErrorResponse } = require("./handleResponse");
const PORT = process.env.PORT || 5000;
app.use(cors());
const serverless = require('serverless-http'); // Import serverless
const mongoose = require('mongoose'); // Import mongoose

// Import the defineDetailsRoutes function and pass the required functions
const defineDetailsRoutes = require("./routes/productsV2")

// Use the router for /api/details route by invoking the defineDetailsRoutes function
const detailsRouter = defineDetailsRoutes(sendSuccessResponse, sendErrorResponse);
app.use("/api", detailsRouter);

app.get("/", (req, res) => {
  res.send("Hi, I am live ");
});

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL); // Make sure to await connectDB
    app.listen(PORT, () => {
      console.log(`${PORT} Yes I am connected`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();

// Lambda handler function
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const handler = serverless(app);
  return await handler(event, context);
};