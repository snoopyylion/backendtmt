import axios from "axios";

const frontend_url = "http://localhost:5173/";
async function makeFlutterWavePayment(
  transactionRefrenceNo,
  email,
  amount,
  fullname,
  redirectUrl = frontend_url
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
        redirect_url: redirectUrl ? redirectUrl : "http://localhost:5173/",
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
    

  res.json({success:true,session_url:session.url})
  return response.data
  } catch (err) {
    console.error(err.code);
    console.error(err.response?.data);
  }
}


export { makeFlutterWavePayment };
