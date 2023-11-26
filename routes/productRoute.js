const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const { uploadImages } = require("../utils/fileUpload");
const router = require('express').Router()

const imgHandler = (req, res, next) => {
    if (req.files) {
        req.body.image = req.files.image[0].filename
        req.body.images = req.files.images.map(img => img.filename)
    }

    next()
}

router.use(authController.isLoggedIn)
router.route('/').get(productController.getAllProducts)
router.route('/:id').get(productController.getProduct)

router.use(authController.restrictTo(['admin']))

router.post('/', uploadImages, imgHandler, productController.createProduct);
router.route('/:id').patch(uploadImages, imgHandler, productController.updateProduct).delete(productController.deleteProduct);

module.exports = router;