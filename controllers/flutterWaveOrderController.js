import axios from "axios";


async function makeFlutterWavePayment(
  transactionRefrenceNo,
  email,
  amount,
  fullname,
  redirectUrl = undefined
) {
  if (typeof amount !== "number") {
    throw Error("Amount must be a number");
  }

  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: transactionRefrenceNo,
        amount: amount,
        currency: "NGN",
        redirect_url: redirectUrl ? redirectUrl : "https://google.com",
        customer: {
          email: email,
          name: fullname,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data
  } catch (err) {
    console.error(err.code);
    console.error(err.response?.data);
  }
}

export { makeFlutterWavePayment };
