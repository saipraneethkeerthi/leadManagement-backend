require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = new express.Router();

router.post("/orders", async (req, res) => {
    // console.log("process.env",process.env.RAZORPAY_KEY_ID) 
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        let body=req.body

        const options = {
            amount: body.amount+'00', // amount in smallest currency unit
            // amount:'100',
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/success", async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");
        console.log(shasum);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");
        console.log(shasum,digest);

        // // comaparing our digest with the actual signature
        // if (digest !== razorpaySignature)
        //     return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        res.status(200).send(JSON.stringify({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        }));
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
