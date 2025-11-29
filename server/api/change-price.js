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
    const {listingId,price}  = req.body;

    console.log(req.body,"  price")

    integrationSdk.listings.update({
    id: listingId,
    price: { amount: parseInt(price.amount), currency: price.currency },
    
    }, {
    expand: true,
    }).then(apiResponse => {

                console.log("Price changed")
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
        });
    

};
