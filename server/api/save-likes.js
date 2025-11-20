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
    const {listingId,userId}  = req.body;

    integrationSdk.listings.show({
      id: listingId.uuid},{
      expand: true,
      }).then(resp => {
      const currentLikesData = resp?.data?.data?.attributes?.publicData?.likes;
      const currentLikes = currentLikesData !== undefined && currentLikesData !== null?currentLikesData:[];
      const remain = currentLikes.filter(itm=>itm !== userId.uuid);

      integrationSdk.listings.update({
      id:listingId.uuid,
      publicData: {
          likes: [...remain,userId.uuid]
      },
      }, {
      expand: true,
      }).then(apiResponse => {
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

    });
        
    

};
