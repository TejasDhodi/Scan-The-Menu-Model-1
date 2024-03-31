const paymentModel = require('../../Model/Payment.Model');

// const getpendingOreders = async (req, res) => {
//     try {
//         const pendingOrders = await paymentModel.find({ delivered: false }).sort({ createdAt: -1 });
//         return res.status(200).json({
//             success: true,
//             message: 'Found pending orders',
//             pendingOrders
//         })
//     } catch (error) {
//         console.log('Unable to find pending orders : ', error);

//         return res.status(500).json({
//             success: false,
//             message: ' Unable to find pending orders ',
//             error: error.message
//         })
//     }
// }

// const getDeliveredOrders = async (req, res) => {
//     try {
//         const deliveredOrders = await paymentModel.find({ delivered: true }).sort({ updatedAt: -1 });
//         return res.status(200).json({
//             success: true,
//             message: 'Found Delivered orders',
//             deliveredOrders
//         })
//     } catch (error) {
//         console.log('Unable to find delivered orders : ', error);

//         return res.status(500).json({
//             success: false,
//             message: ' Unable to find Delivered orders ',
//             error: error.message
//         })
//     }
// }

const setDeliveryStatusTrue = async (req, res) => {
    try {
        const setStatusTrue = await paymentModel.findByIdAndUpdate(req.params.id,
            { delivered: true },
            { new: true }
        )

        if (!setStatusTrue) {
            return res.status(404).json({
                success: false,
                message: 'Unable to set status true or order not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Status Updated to True',
            setStatusTrue
        })

    } catch (error) {
        console.log('Unable to Update delivered status : ', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to update delivery status',
            error: error.message
        });
    }
}

const setDeliveryStatusFalse = async (req, res) => {
    try {
        const setStatusTrue = await paymentModel.findByIdAndUpdate(req.params.id,
            { delivered: false },
            { new: true }
        )

        if (!setStatusTrue) {
            return res.status(404).json({
                success: false,
                message: 'Unable to set status false or order not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Status Updated to false',
            setStatusTrue
        })

    } catch (error) {
        console.log('Unable to Update delivered status : ', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to update delivery status',
            error: error.message
        });
    }
}

const setPaginationOnPending = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        
        const orders = await paymentModel.find({ delivered: false });

        const startIndex = (page - 1) * limit;
        const lastIndex = page * limit;

        const result = {};
        result.totalOrders = orders.length;
        result.pageCount = Math.ceil(orders.length / limit)

        if (lastIndex < orders.length) {
            result.next = {
                page: page + 1
            }
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1
            }
        }

        result.paginatedResult = orders.slice(startIndex, lastIndex)

        res.status(200).json({
            success: true,
            message: 'Pagination Applied',
            result
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Pagination Failed',
            error: error.message
        })
    }
}

const setPaginationOnDelivered = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        
        const orders = await paymentModel.find({ delivered: true });
        console.log(orders.length);

        const startIndex = (page - 1) * limit;
        const lastIndex = page * limit;

        const result = {};
        result.totalOrders = orders.length;
        result.pageCount = Math.ceil(orders.length / limit)

        if (lastIndex < orders.length) {
            result.next = {
                page: page + 1
            }
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1
            }
        }

        result.paginatedResult = orders.slice(startIndex, lastIndex)

        res.status(200).json({
            success: true,
            message: 'Pagination Applied',
            result
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Pagination Failed',
            error: error.message
        })
    }
}

const getAllPaymentData = async (req, res) => {
    try {
        const paymentData = await paymentModel.find();
        return res.status(200).json({
            success: true,
            message: 'Received all payments data',
            paymentData
        })
    } catch (error) {
        console.log('Unable to get the payments data', error);
        res.status(500).jsno({
            success: false,
            message: 'Unable to get the payments data',
            error: error.message
        })
    }
}

module.exports = { setDeliveryStatusTrue, setDeliveryStatusFalse, setPaginationOnPending, setPaginationOnDelivered, getAllPaymentData };