const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const { uploadImages } = require("../utils/fileUpload");
const router = require("express").Router();

const imgHandler = (req, res, next) => {
    if (req.files) {
        req.body.picture = req.files.image[0].filename
    }

    next()
}

router.use(authController.isAuth)
router.route('/cart').post(authController.addToCart).get(authController.getUsersCart)

router.route('/me').get(userController.getMe).patch(uploadImages, imgHandler, userController.updateMe).delete(userController.deleteMe)

router.use(authController.restrictTo(['admin']))
router.route("/").get(userController.getAllUsers);
router.route('/:id').get(userController.getUser).patch(uploadImages, imgHandler, userController.updateUser).delete(userController.deleteUser);

module.exports = router;
