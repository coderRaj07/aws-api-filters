const express = require("express");
const router = express.Router();
const {
  getProducts,
  findProducts,
} = require("../controllers/products");

// Import any necessary controllers or functions related to details

// Define a function that defines the details-related routes
const defineDetailsRoutes = (sendSuccessResponse, sendErrorResponse) => {
  // Define route for getting details
  router.route("/").get(async (req, res) => {
    try {
      const products = await getProducts(req,res);
      //res.json(products);
      sendSuccessResponse(req,res,products)
    } catch (error) {
      sendErrorResponse(req, res, error);
    }
  })

  // Define other details-related routes as needed

  return router;
};

module.exports = defineDetailsRoutes;
