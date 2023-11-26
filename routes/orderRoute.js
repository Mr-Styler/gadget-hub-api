const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');
const router = require('express').Router({ mergeParams: true});

router.use(authController.isLoggedIn)

router.route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createOrder);
router.route('/:id')
.get(orderController.getOrder)

router.use(authController.restrictTo(['admin']))

router.route('/:id')
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder)

    module.exports = router