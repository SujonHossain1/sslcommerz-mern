const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
    {
        cartItems: {
            type: Array,
            default: [],
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        deliveryMethod: {
            type: String,
            default: '',
        },
        numItem: {
            type: Number,
            default: 0,
        },
        transactionId: {
            type: String,
            required: true,
        },
        paymentDone: {
            type: Boolean,
            default: false,
        },
        customerInfo: {
            type: Object,
            default: {
                name: '',
                email: '',
                add1: '',
                add2: '',
                city: '',
                postCode: '',
                country: 'Bangladesh',
                phone: '',
                fax: '',
            },
        },
        shippingInfo: {
            type: Object,
            default: {
                name: '',
                email: '',
                add1: '',
                add2: '',
                city: '',
                postCode: '',
                country: 'Bangladesh',
                phone: '',
            },
        },
    },
    { timestamps: true }
);

const Order = model('order', orderSchema);
module.exports = Order;
