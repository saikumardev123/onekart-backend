const express = require('express');

const productRouter =express.Router();

var productController  = require('../controllers/product.controller');

productRouter.post('/add', productController.add);
module.exports = productRouter;