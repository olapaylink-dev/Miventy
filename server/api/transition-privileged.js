const { transactionLineItems } = require('../api-util/lineItems');
const {
  getSdk,
  getTrustedSdk,
  handleError,
  serialize,
  fetchCommission,
} = require('../api-util/sdk');

module.exports = (req, res) => {
  const { isSpeculative, orderData, bodyParams, queryParams } = req.body;

  console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooo")
  console.log(req.body,"     123 vvvvvvvvvvvvvvvvvvvvvvvvvvv")

  const sdk = getSdk(req, res);
  let lineItems = null;
console.log("oooooooooooooooooooooooooooooo22222222ooooooooooooooooooooooo")
  const listingPromise = () => sdk.listings.show({ id: bodyParams?.params?.listingId });
console.log("oooooooooooooooooooooooooooo3333333ooooooooooooooooooooooooo")
  Promise.all([listingPromise(), fetchCommission(sdk)])
    .then(([showListingResponse, fetchAssetsResponse]) => {
      const listing = showListingResponse.data.data;
      const commissionAsset = fetchAssetsResponse.data.data[0];

      const { providerCommission, customerCommission } =
        commissionAsset?.type === 'jsonAsset' ? commissionAsset.attributes.data : {};
console.log("ooooooooooooooooooooooooooo44444444444oooooooooooooooooooooooooo")
      lineItems = transactionLineItems(
        listing,
        { ...orderData, ...bodyParams.params },
        providerCommission,
        customerCommission
      );
console.log("ooooooooooooooooooooooooo44444444AAAAAAAAAAAAoooooooooooooooooooooooooooo")
      return getTrustedSdk(req);
    })
    .then(trustedSdk => {
      // Omit listingId from params (transition/request-payment-after-inquiry does not need it)
      const { listingId, ...restParams } = bodyParams?.params || {};

      // Add lineItems to the body params
      const body = {
        ...bodyParams,
        params: {
          ...restParams,
          lineItems,
        },
      };
console.log("ooooooooooooooooooooooooo555555555555oooooooooooooooooooooooooooo")
console.log("eeeeeeeeeeeeeeeeeeeeeeee",JSON.stringify(body))
      if (isSpeculative) {
        return trustedSdk.transactions.transitionSpeculative(body, queryParams);
      }
      return trustedSdk.transactions.transition(body, queryParams);
    })
    .then(apiResponse => {
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
    })
    .catch(e => {
      handleError(res, e);
    });
};
