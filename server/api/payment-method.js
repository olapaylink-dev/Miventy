const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

const { serialize } = require('../api-util/sdk');
const { parse } = require('query-string');

module.exports = async (req, res)  =>  {
  const data = req.body;
  const amount = data.price;
  const currency = "EUR";
  const title = data.title;
  const txId = data.txId;
  const stripeAccountId = data.stripeAccountId;
  const quantity = data.quantity || 1;

  console.log(stripeAccountId,"   ",quantity);

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      payment_method_types: ['bancontact', 'card', 'ideal',],
      client_reference_id: txId,
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: title,
          },
          unit_amount: parseInt(amount),
        },
        quantity:quantity
      }],
       payment_intent_data: {
          on_behalf_of: stripeAccountId,
          transfer_group: 'ORDER100',
        },
      mode: 'payment',
       success_url: `https://boomgoes-2sop.onrender.com/${txId}/${"successful"}/success`,
       cancel_url: 'https://boomgoes-2sop.onrender.com/cancel',
      //success_url: `http://localhost:4000/${txId}/${"successful"}/success`,
      //cancel_url: 'http://localhost:4000/cancel',
    });

    const { status } = session;
    console.log(session);
    res
    .status(200)
    .set('Content-Type', 'application/transit+json')
    .send(
      {
        session
      }
    )
    .end();

    
}