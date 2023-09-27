const Joi = require('joi');
const Product = require('../models/product.js');
const Q = require('q');

const getProducts = async (req, res) => {
    const queryParameters = req.query;

    // Define schema for validation using Joi
    const schema = Joi.object({
        search: Joi.string().allow(''), // Allow an empty string for search
        price: Joi.alternatives(
            Joi.number(),
            Joi.array().items(Joi.number())
        ), // Allow selecting a single price or multiple price values
        featured: Joi.boolean(),
        page: Joi.number().default(1),
        perPage: Joi.number().default(10),
    });

    // Validate user input
    const { error, value } = schema.validate(queryParameters);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { page, perPage, search, ...filter } = value; // Destructure filter properties
    
  
    // Modify and extend the filter object based on properties selected
    for (const key in filter) {
        if (key === 'price') {
            // if price is single query
            if (!Array.isArray(filter[key])) {
                filter[key] = filter[key];
            }
            filter[key] = { $in: filter[key] }; // Filter by multiple prices
        }
        if (key === 'featured') {
            filter[key] = filter[key]; // Filter by a single selected feature (true or false)
        }
    }

    // Build the filter object based on user search
    if (search) {
        // If there's a search query, prioritize searching for company or name
        filter.$or = [
            { company: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
        ];
    }

    // Calculate skip and limit for pagination
    const skip = (page - 1) * perPage;
    const limit = perPage;
    
    try {
        const products = await findProducts(filter, skip, limit);
     // don't return json response here
     // res.json(products);
     // as we will be handling it inside routers sendSuccessResonse()   
     
     //just return the result
        return products;
    } catch (error) {

     // don't return json response here
     // res.status(500).json({ error: 'Internal server error' });
     // as we will be handling it inside routers sendErrorResonse()
     
     //just return the error
        return error;
    }
};

const findProducts = async (filter, skip, limit) => {
    try {
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit)  //exec() is removed since it's no longer supported and causing issue in serverless deployment
        return products;
    } catch (err) {
        throw err; // You can handle the error at a higher level if needed
    }
};

module.exports = { getProducts, findProducts };
