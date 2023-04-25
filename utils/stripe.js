import dotenv from 'dotenv';
import Stripe from "stripe";
import ffprobe from "ffprobe";
import ffprobeStatic from "ffprobe-static";
import fs from "fs";

dotenv.config();

// const stripe = Stripe(process.env.STRIPE_TEST_KEY) // test key
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY) // prod key

export async function createPaymentIntent(filePath, res) {
  try {
    const metadata = await ffprobe(filePath, { path: ffprobeStatic.path });
    const audioStream = metadata.streams.find((stream) => stream.codec_type === "audio");

    if (audioStream) {
      const durationInSeconds = audioStream.duration;
      const durationInMinutes = durationInSeconds / 60;
      // const stripePrice = await stripe.prices.retrieve('price_1MrtVDJD5XPjP7WOs2qhF7wf'); // test price
      const stripePrice = await stripe.prices.retrieve('price_1Mzz2VJD5XPjP7WOJ0Bq4erM'); // prod price
      const centsPerMin = stripePrice.unit_amount;
      let priceInCents = Math.floor(durationInMinutes * centsPerMin);

      // Ensure the amount is at least 50 cents
      priceInCents = Math.max(priceInCents, 50);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: priceInCents,
        currency: "aud",
      });
  
      // Create a PaymentIntent with the order amount and currency
      res.send({
        clientSecret: paymentIntent.client_secret
      });
    }

  } catch (error) {
    console.error(`Error creating payment intent: ${error}`);
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${filePath} was deleted`);
    });
  }
}