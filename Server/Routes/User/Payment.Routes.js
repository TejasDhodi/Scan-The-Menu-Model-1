const express = require('express');
const { checkoutPayment, verifyPayment, getSinglePayment, getpendingOreders } = require('../../Controller/User/Payment.controller');
const router = express.Router();

router.route('/checkout').post(checkoutPayment);
router.route('/checkout/verifyPayment').post(verifyPayment);
router.route('/checkout/detail/:paymentId').get(getSinglePayment);

module.exports = router;