

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
const {email,token,pw} = req.body;

const sdk = getSdk(req, res);

    sdk.passwordReset.reset({
        email: email,
        passwordResetToken: token,
        newPassword: pw
      },{expand:true}).then(res => {
        // res.data
        
        dispatch(passwordRecoverySuccess());

      });

}