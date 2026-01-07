
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
    const {providerId,customerId}  = req.body;

   const updateProvider = integrationSdk.users.show({id: providerId})
    .then(res => {
        // res.data contains the response data
        const declinedTrx = res.data.data.attributes.protectedData.declinedTrx;
        declinedTrx.push({trxId});

        integrationSdk.users.updateProfile({
            id: providerId,
            protectedData: {
                declinedTrx
            },
            }, {
            expand: true,
            }).then(resp => {
              return resp;
            })
    });

  const updateCustomer =  integrationSdk.users.show({id: customerId})
    .then(res => {
        // res.data contains the response data
        const declinedTrx = res?.data?.data?.attributes?.protectedData?.declinedTrx;
        declinedTrx.push({trxId});

        integrationSdk.users.updateProfile({
            id: customerId,
            protectedData: {
                declinedTrx
            },
            }, {
            expand: true,
            }).then(resp => {
              return resp;
            })
    });

  
 Promise.all([updateProvider(), updateCustomer()])
    .then(([updateProviderResponse, updateCustomerResponse]) => {
       const { status, statusText, data } = updateCustomerResponse;
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
    })













};
