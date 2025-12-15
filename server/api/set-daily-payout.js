const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

module.exports = async (req, res)  =>  {

  const data = req.body;
  const id = data.sId; //stripeId
 
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // const balanceSettingsResponse = await stripe.balanceSettings.retrieve({
    //   stripeAccount: '{{CONNECTED_ACCOUNT_ID}}',
    // });

    console.log("Setting daily payout")

    const balanceSettings = await stripe.balanceSettings.update(
      {
        payments: {
          payouts: {
            schedule: {
              interval: 'daily'
            },
          },
        },
      },
      {
        stripeAccount: id
      }
    );

    const { status } = balanceSettings;
    console.log(balanceSettings);
    res
    .status(200)
    .set('Content-Type', 'application/transit+json')
    .send(
      {
        balanceSettings
      }
    )
    .end();

    
}