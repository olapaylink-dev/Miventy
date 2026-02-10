const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

const { serialize } = require('../api-util/sdk');
const { parse } = require('query-string');

module.exports = async (req, res)  =>  {
    
  const stripeAccountId =  req.body;
//   const quantity = data.quantity || 1;

  //console.log(stripeAccountId," uuuuuuuuuuuuuuuuuuuuuuuuuuuu  ");

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const balance = await stripe.balance.retrieve(
        {
            expand: ['instant_available.net_available'],
        },
        {
            stripeAccount: stripeAccountId,
        }
    );

    //console.log(balance,"   aaaaaaaaaaaaaaaaaaaaaaaaaa");

    res
    .status(200)
    .set('Content-Type', 'application/transit+json')
    .send(
      {
        balance
      }
    )
    .end();

    
}