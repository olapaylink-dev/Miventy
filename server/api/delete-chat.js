
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
    const {customerId,providerId,trxId}  = req.body;
    console.log(req.body,"   sssqqs")

   const updateProvider = integrationSdk.users.show({id: providerId})
    .then(res => {
        // res.data contains the response data
        const deletedChat = res?.data?.data?.attributes?.profile?.protectedData?.deletedChat || [];
        deletedChat.push(trxId);
        console.log(deletedChat,"     xx123xxx")
        
      return  integrationSdk.users.updateProfile({
            id: providerId,
            protectedData: {
                deletedChat
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
         const deletedChat = res?.data?.data?.attributes?.profile?.protectedData?.deletedChat || [];
         deletedChat.push(trxId);
        console.log(deletedChat,"     xxxxx")

      return  integrationSdk.users.updateProfile({
            id: customerId,
            protectedData: {
                deletedChat
            },
            }, {
            expand: true,
            }).then(resp => {
              return resp;
            })
    });

  
 Promise.all([updateProvider, updateCustomer])
    .then(([updateProviderResponse,updateCustomerResponse]) => {
      console.log("pppppppppppppppppppppp")

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
