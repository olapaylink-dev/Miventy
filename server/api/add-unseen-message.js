
const {
  getSdk,
  getTrustedSdk,
  handleError,
  serialize,
  fetchCommission,
} = require('../api-util/sdk');
const { v4 } = require('uuid');

const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

module.exports = (req, res) => {
    const trxId  = req.body.trxId;
    console.log(req.body,"   mmmmmmmmmmmmmmmmmmmmm");
   
   integrationSdk.transactions.show(
            {
                id:trxId,
                include: [
                  'customer',
                  'customer.profileImage',
                  'provider',
                  'provider.profileImage',
                  'listing',
                  'listing.currentStock',
                  'listing.images',
                  'booking',
                  'reviews',
                  'reviews.author',
                  'reviews.subject',
                  'metaData',
                  'stripeCustomer.defaultPaymentMethod',
                  'customer.stripeCustomer',
                  'provider.stripeCustomer'
                ],
              },
              { expand: true }
    ).then(respon => {
    // res.data contains the response data
    const {customer,provider} = respon?.data?.data.relationships;

    const updateProvider = integrationSdk.users.show({id: provider.data.id.uuid})
    .then(resp => {
        // res.data contains the response data
        const unseenMsg = resp?.data?.data?.attributes?.profile?.protectedData?.unseenMsg || [];
        unseenMsg.push(trxId);
        
      return  integrationSdk.users.updateProfile({
            id: provider.data.id.uuid,
            protectedData: {
                unseenMsg
            },
            }, {
            expand: true,
            }).then(resp => {
              return resp;
            })
    });

    const updateCustomer =  integrationSdk.users.show({id: customer?.data?.id?.uuid})
    .then(resp => {
        // res.data contains the response data
        const unseenMsg = resp?.data?.data?.attributes?.profile?.protectedData?.unseenMsg || [];
        unseenMsg.push(trxId);

      return  integrationSdk.users.updateProfile({
            id: customer?.data?.id?.uuid,
            protectedData: {
                unseenMsg
            },
            }, {
            expand: true,
            }).then(resp => {
              return resp;
            })
    });

  
    Promise.all([updateProvider, updateCustomer])
    .then(([updateProviderResponse,updateCustomerResponse]) => {
        console.log("1111111111111111111111111")
       const { status, statusText, data } = updateCustomerResponse || {};

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






    });

    

};
