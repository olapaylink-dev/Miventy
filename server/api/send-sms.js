// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// module.exports = (req,res)=>{
// client.messages
//   .create({
//     body: 'Your authentication code is 1234',
//     from:'+34971111097',
//     to: '+2348067565788'
//   })
//   .then(message => console.log(message.sid));
// }



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const {
  getSdk,
  getTrustedSdk,
  handleError,
  serialize,
  fetchCommission,
} = require('../api-util/sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

module.exports = (req,res)=>{
  console.log(req.body, "res.body")
const {email,otp} = req.body;

integrationSdk.users.show({email: email}).then(resp => {
  // res.data contains the response data
  const phone = resp?.data?.data?.attributes?.profile?.protectedData?.phoneNumber;
  console.log(phone,"      ==========")
  client.messages
  .create({
    body: `Your authentication code is ${otp}`,
    //from:'+34971111097',
    from:'+34955165168',
    to: phone
  })
  .then(message => {
                const { status="200", statusText="success", data={data:phone}} = message;
                res
                //.status(status)
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


}