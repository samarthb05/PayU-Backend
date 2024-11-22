const express = require("express");
const router = express.Router();
const { initiatePayment } = require("./controller");

router.post("/create-order", initiatePayment);

//webhook
router.post("/webhook", async (request, response) => {
  if (request.body.status === "success") {
    const payment = {
      orderId: request.body.txnid,
      amount: parseInt(request.body.amount),
      gateway: "payu",
    };
  }
  response.send({ status: "success", message: "data received" });
});

module.exports = router;
