const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

const { serialize } = require('../api-util/sdk');
const { parse } = require('query-string');

module.exports = async (req, res)  =>  {
    
  const data =  req.body;
  const amount = data.amount;
  const sid = data.sid;

  console.log(sid," uuuuuuuuuuuuuuuuuuuuuuuuuuuu  ",amount);

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        console.log(res, "   aaaaaaaaaaaaaaaaaaaa")
         const payout = await stripe.payouts.create(
            {
                amount: parseInt(amount),
                currency: 'usd',
                method: 'instant',
                destination:"btok_us_verified",
            },
            {
                stripeAccount: sid,
            }
        );
        console.log(amount,"   aaaaaaaaaaaaaaaaaaaaaaaaaa");

        res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(
        {
            payout
        }
        )
        .end();
    
}