const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = (req,res)=>{
client.messages
  .create({
    body: 'Your authentication code is 1234',
    from:'+34971111097',
    to: '+2348067565788'
  })
  .then(message => console.log(message.sid));
}