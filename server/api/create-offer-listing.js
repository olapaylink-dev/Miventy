const { transactionLineItems } = require('../api-util/lineItems');
const {
  getSdk,
  getTrustedSdk,
  handleError,
  serialize,
  fetchCommission,
} = require('../api-util/sdk');

const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

module.exports = (req, res) => {
    const listing  = req.body;
    integrationSdk.listings.create(
      listing,
      {
        expand: true,
      }

    ).then(apiResponse => {
            
            //console.log("aaaaaaaaaaaaaaaaaaaaa   ",apiResponse);
            const { status, statusText, data } = apiResponse;
            res
            .status(status)
            .set('Content-Type', 'application/transit+json')
            .send(
            serialize({
                status,
                statusText,
                data,
            })
            )
            .end();
        }
        
    ).catch(e => {
      //console.log(JSON.stringify(e.data));
    });


 //console.log(listing)
};
