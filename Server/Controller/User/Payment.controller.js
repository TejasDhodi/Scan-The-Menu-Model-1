const Razorpay = require('razorpay');
var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
const paymentModel = require('../../Model/Payment.Model');

const crypto = require('crypto');

const checkoutPayment = async (req, res) => {
    try {
        const { user, orderedDish, amount, delivered } = req.body;

        var options = {
            amount: Number(amount * 100),
            currency: "INR",
        };

        const order = await instance.orders.create(options);

        const orderData = await paymentModel.create({
            order_id: order.id,
            user,
            orderedDish,
            amount,
            delivered
        })

        return res.status(200).json({
            success: true,
            message: 'Payment data',
            orderData
        })

    } catch (error) {
        console.log('Unable to post Payment data form controller : ', error);

        return res.status(500).json({
            success: false,
            message: 'Payment data fail',
            error: error.message
        })
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body

        const text = `${razorpay_order_id}|${razorpay_payment_id}`;

        const generatedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET).update(text).digest('hex');

        if (generatedSignature === razorpay_signature) {
            const updatedData = await paymentModel.findOneAndUpdate({ order_id: razorpay_order_id }, {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
            })

            return res.redirect(`https://scan-the-menu.vercel.app/success?payment_id=${razorpay_payment_id}&payment=${updatedData._id}`);
        } else {
            return res.redirect('https://scan-the-menu.vercel.app/fail')
        }

    } catch (error) {
        console.log('Unable to Verify Payment data form controller : ', error);

        return res.status(500).json({
            success: false,
            message: 'Payment Verification fail',
            error: error.message
        })
    }
}

const getSinglePayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const singlePayment = await paymentModel.find({ razorpay_payment_id: paymentId });
        return res.status(200).json({
            success: true,
            message: 'Received payment',
            singlePayment
        });
    } catch (error) {
        console.log('Unable to Get Single Payment data from controller : ', error);

        return res.status(500).json({
            success: false,
            message: 'Payment Fetching failed',
            error: error.message
        });
    }
};


module.exports = { checkoutPayment, verifyPayment, getSinglePayment }