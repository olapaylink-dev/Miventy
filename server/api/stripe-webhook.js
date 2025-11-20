const express = require('express');
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const { serialize } = require('../api-util/sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
});


// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.REACT_APP_STRIPE_WEBHOOK;
console.log("Running =====");
module.exports = (request, response) => {

 // console.log("Ruuning ------------------    "+endpointSecret);
 // console.log("Ruuning ------------------");
 //console.log(JSON.stringify(request.body));

 const apiData = request.body;

  let userEmail = null;
  let subscription = null;
 try{
   //console.log("apiData.customer_emailng ---------22111111111111111122---------           " + apiData.data.object.customer_email);
   //console.log(JSON.stringify(apiData.data.object));
    userEmail = apiData.data.object.customer_email;
    subscription = apiData.data.object.lines.data[0].description;

   //console.log("Ruuning ---------22333333333333322---------");

   if(userEmail === null){
    //console.log("Ruuning ---------22444444444444444422---------");
    //console.log(JSON.stringify(apiData.data.object.customer_details));
    userEmail = apiData.data.object.customer_details.email;
    subscription = "1 × Local Subscription (at $0.00 / month)";
   }

}catch(e){
  if(userEmail === null){
    //console.log("Ruuning ---------22444444444444444422---------");
    //console.log(JSON.stringify(apiData.data.object.customer_details));
    userEmail = apiData.data.object.customer_details.email;
    subscription = "1 × Local Subscription (at $0.00 / month)";
   }
}
  

  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  // if (endpointSecret) {
  //   // Get the signature sent by Stripe
  //   const signature = request.headers['stripe-signature'];
  //   console.log("signature ------------------  " + signature);
  //   try {
  //     event = stripe.webhooks.constructEvent(
  //       request.body,
  //       signature,
  //       endpointSecret
  //     );
  //   } catch (err) {
  //     console.log(`⚠️  Webhook signature verification failed.`, err.message);
  //     return response.sendStatus(400);
  //   }
  // }

  //console.log("Ruuning ---------22aaaaaaaaaaaaa22---------");
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);

      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    case 'invoice.payment_succeeded':
      const paymentInvoice = event.data.object;
      console.log(paymentInvoice);

      break;

    default:
      // Unexpected event type
     // console.log(`Unhandled event type ${event.type}.`);
  }


  integrationSdk.users.query(
    {
      include:['listing']
    }
  ).then(apiResponse => {

   //console.log("-----------------------");

   //console.log(JSON.stringify(apiResponse));

    const data = apiResponse.data.data;
    //console.log("----userEmail-------11111111111------------      " + userEmail);
    data.map((itm,k)=>{
      //console.log("-----------111112222222222111111------------");
      if(itm.attributes.email === userEmail){

        //console.log("-----------11111111111------------");

        integrationSdk.users.updateProfile({
          id: itm.id,
          protectedData: {
            subscriptionPlan: subscription
          },
         
        }, {
          expand: true
        }).then(res => {
          // res.data
          console.log("Account updated");
          console.log(res.data);
        });


      }
    });

    // const { status, statusText, data } = apiResponse;
    // res
    // .status(status)
    // .set('Content-Type', 'application/transit+json')
    // .send(
    //   {
    //     status,
    //     statusText,
    //     data,
    //   }
    // )
    // .end();
  })


  response.send();
}

