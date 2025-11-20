const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

const {
  getSdk,
  getTrustedSdk,
  handleError,
  serialize,
  fetchCommission,
} = require('../api-util/sdk');

module.exports = (req, res) => {
  const { txId,data } = req.body;
  console.log(req.body,"     ccccccccxxxxxxxxxxx")

  integrationSdk.transactions.updateMetadata({
  id: txId,
   metadata: {
          offer: data,
        },
    }, {
    expand: true
    }).then(apiResponse => {
    // res.data contains the response data
       const { status, statusText, data } = apiResponse;
       console.log(apiResponse)
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
