const crudFunc = require("../utils/CRUD");
const Product = require("../models/productModel");

exports.getAllProducts = crudFunc.getAll(Product);

exports.getProduct = crudFunc.getOne(Product);

exports.createProduct = crudFunc.createNew(Product);

exports.updateProduct = crudFunc.updateOne(Product);

exports.deleteProduct = crudFunc.deleteOne(Product);
