const SSLCOMMERZ = require('ssl-commerz-node');
const PaymentSession = SSLCOMMERZ.PaymentSession;
const shortId = require('shortid');
const Order = require('../model/Order');

const payment = new PaymentSession(
    true,
    process.env.SSLCOMMERZ_STORE_ID,
    process.env.SSLCOMMERZ_STORE_PASSWORD
);

exports.sslCommerzPaymentInit = async (res, res, next) => {
    const {
        cartItems,
        totalAmount,
        deliveryMethod,
        numItem,
        customerInfo,
        shippingInfo,
    } = req.body;

    const transactionId = `transaction_${shortId.generate()}`;

    if (
        !(cartItems.length >= 0) ||
        !(totalAmount > 0) ||
        !(deliveryMethod.length > 0) ||
        !(numItem > 0) ||
        !customerInfo ||
        !shippingInfo
    ) {
        return res.status(400).json({
            message: 'All field must be required',
        });
    }

    try {
        payment.setUrls({
            success: `${process.env.SERVER_URL}/api/payment/checkout/success?transactionId=${transactionId}`,
            fail: `${process.env.SERVER_URL}/api/payment/checkout/fail`,
            cancel: `${process.env.SERVER_URL}/api/payment/checkout/cancel`,
            ipn: `${process.env.SERVER_URL}/ipn`,
        });

        payment.setOrderInfo({
            totalAmount: totalAmount,
            currency: 'BDT',
            tran_id: transactionId,
            emi_option: 0,
            multi_card_name: 'internetbank',
            allowed_bin: '371598,371599,376947,376948,376949', // Do not Use! If you do not control on transaction
            emi_max_inst_option: 3, // Max instalment Option
            emi_allow_only: 0,
        });

        // Set customer info
        payment.setCusInfo({
            name: customerInfo.name,
            email: customerInfo.email,
            add1: customerInfo.add1,
            add2: customerInfo.add2,
            city: customerInfo.city,
            state: customerInfo.state,
            postcode: customerInfo.postCode,
            country: customerInfo.country,
            phone: customerInfo.phone,
            fax: customerInfo.fax,
        });

        payment.setShippingInfo({
            method: deliveryMethod, //Shipping method of the order. Example: YES or NO or Courier
            num_item: numItem,
            name: shippingInfo.name,
            add1: shippingInfo.add1,
            add2: shippingInfo.add2,
            city: shippingInfo.city,
            state: shippingInfo.state,
            postcode: shippingInfo.postCode,
            country: shippingInfo.country,
        });

        // Set Product Profile
        payment.setProductInfo({
            product_name: cartItems.map((i) => i.productName).join(', '),
            product_category: 'Electronics',
            product_profile: 'general',
        });
    } catch (err) {
        next({
            message: err.message,
            status: 500,
        });
    }
};
