const express = require('express');
const { setDeliveryStatusTrue, setDeliveryStatusFalse, setPaginationOnPending, setPaginationOnDelivered, getAllPaymentData } = require('../../Controller/Admin/Payment.controller');
const router = express.Router();

// router.route('/orders/pending').get(getpendingOreders);
// router.route('/orders/delivered').get(getDeliveredOrders);
router.route('/orders/delivered/:id').put(setDeliveryStatusTrue);
router.route('/orders/undoDelivered/:id').put(setDeliveryStatusFalse);
router.route('/orders/pending').get(setPaginationOnPending);
router.route('/orders/delivered').get(setPaginationOnDelivered);
router.get('/paymentData', getAllPaymentData)

module.exports = router;