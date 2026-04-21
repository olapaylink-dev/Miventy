
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
    const {customerId,providerId,trxId,title,pageToGo,senderId}  = req.body;
    console.log(req.body,"   cccccccccccccccccccccccccccccccccccccccccc")
    console.log(v4())

   const updateProvider = integrationSdk.users.show({id: providerId})
    .then(res => {
        // res.data contains the response data
        const notifications = res?.data?.data?.attributes?.profile?.protectedData?.notifications || [];
        const createdAt = new Date();
        const data = {
            id:v4(),
            trxId,
            title,
            pageToGo,
            customerId,
            createdAt
        }
        notifications.push(data);
        
      return  integrationSdk.users.updateProfile({
            id: providerId,
            protectedData: {
                notifications
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
        const notifications = res?.data?.data?.attributes?.profile?.protectedData?.notifications || [];
        const createdAt = new Date();
        const data = {
            id:v4(),
            trxId,
            title,
            pageToGo,
            customerId,
            createdAt
        }
        notifications.push(data);

      return  integrationSdk.users.updateProfile({
            id: customerId,
            protectedData: {
                notifications
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

};
