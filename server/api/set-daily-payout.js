const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

module.exports = async (req, res)  =>  {

  const id = req.body;
 
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const balanceSettingsResponse = await stripe.balanceSettings.retrieve({
      stripeAccount: id,
    });

    const statuss = balanceSettingsResponse?.payments?.payouts?.status;
    if(statuss !== "enabled"){
        //console.log("statuss",statuss)
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
   

    
}