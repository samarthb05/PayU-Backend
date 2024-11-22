const crypto = require("crypto");
require("dotenv").config();
const axios = require("axios");

module.exports.initiatePayment = async (req, res) => {
  const { firstName, email, phone, amount } = req.body;

  const txnid = `txn${new Date().getTime()}`;
  const productinfo = "Test Product";
  const surl = "http://localhost:3000/payU/success";
  const furl = "http://localhost:3000/payU/failure";
  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;

  // hash generation
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstName}|${email}|||||||||||${salt}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  const paymentData = {
    key,
    txnid,
    amount,
    productinfo,
    firstName,
    email,
    phone,
    surl,
    furl,
    hash,
    service_provider: "payu_paisa",
  };
  const response = await axios.post(
    `${process.env.PAYU_BASE_URL}/_payment`,
    paymentData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const upiLink = response.request.res.responseUrl;

  try {
    res.status(200).json({
      message: "PayU order created successfully!",
      orderData: {
        txnid,
        amount,
        upiLink,
        gateway: "payu",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
