const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

module.exports = async (req, res)  =>  {
    
  const data =  req.body;
  const totalPayout = data.totalPayout;
  const providerId = data.providerId;

    integrationSdk.users.show({id: providerId})
        .then(async resp => {
            // res.data contains the response data
            const accId = resp?.data?.data?.attributes?.profile?.publicData?.stripeAccountId || [];

            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

            console.log(resp, "   aaaaaaaaaaaaaaaaaaaa")
        
            const transfer = await stripe.transfers.create({
            amount: parseInt(totalPayout),
            currency: 'usd',
            destination: accId,
            transfer_group: 'ORDER_95',
            });

                res
                .status(200)
                .set('Content-Type', 'application/transit+json')
                .send(
                {
                    transfer
                }
                )
                .end();

        })
        .catch((e)=>{
            console.log(e)
        })

  
    
}