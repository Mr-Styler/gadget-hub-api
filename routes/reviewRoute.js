const reviewController = require("./../controllers/reviewController");
const authController = require('./../controllers/authController');
const router = require("express").Router({ mergeParams: true });

router.use(authController.isLoggedIn)

router.route('/').get(reviewController.getAllReview).post((req, res, next) => {
    if (!req.body.userId) {
        req.body.userId = req.user._id
    }
    console.log(req.body)
    next();
},reviewController.createReview);
router.route('/:id').get(reviewController.getReview)

router.use(authController.restrictTo(['admin']))

router.route('/:id')
.patch(reviewController.updateReview).delete(reviewController.deleteReview);

module.exports = router;