const queryFunc = require('./../utils/docFactoryFunc');
const Order = require('../models/orderModel');

exports.getAllOrders = queryFunc.getAll(Order);

exports.getOrder = queryFunc.getOne(Order);

exports.createOrder = queryFunc.createNew(Order);

exports.updateOrder = queryFunc.updateOne(Order);

exports.deleteOrder = queryFunc.deleteOne(Order);