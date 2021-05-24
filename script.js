let paymentsResponse; // The `/paymentMethods` response from the server.

function makePayment(){ // Your function calling your server to make the `/payments` request
    return;
}
function showFinalResult(response){ // Your function to show the final result to the shopper
    return;
}

let credentials = {
    key: 'key'
};

const configuration = {
 paymentMethodsResponse: paymentsResponse,
 clientKey: credentials.key, // Web Drop-in versions before 3.10.1 use originKey instead of clientKey. // TODO
 locale: "en-US",
 environment: "test",
 onSubmit: (state, dropin) => {
     // Global configuration for onSubmit
     makePayment(state.data)
       .then(response => {
         if (response.action) {
           dropin.handleAction(response.action); // Drop-in handles the action object from the /payments response
         } else {
           showFinalResult(response);
         }
       })
       .catch(error => {
         throw Error(error);
       });
   },
 onAdditionalDetails: (state, dropin) => {
   makeDetailsCall(state.data) // Your function calling your server to make a `/payments/details` request
     .then(response => {
       if (response.action) {
         dropin.handleAction(response.action); // Drop-in handles the action object from the /payments response
       } else {
         showFinalResult(response);
       }
     })
     .catch(error => {
       throw Error(error);
     });
 },
 paymentMethodsConfiguration: {
   card: { // Example optional configuration for Cards
     hasHolderName: true,
     holderNameRequired: true,
     enableStoreDetails: true,
     hideCVC: false,
     name: 'Credit or debit card',
     onSubmit: () => {}, // onSubmit configuration for card payments. Overrides the global configuration.
   }
 }
};

const checkout2 = new AdyenCheckout(configuration);
const dropin = checkout2
    .create('dropin', {
    // Starting from version 4.0.0, Drop-in configuration only accepts props related to itself and cannot contain generic configuration like the onSubmit event.
        openFirstPaymentMethod:false
    })
   .mount('#dropin-container');

console.log('noice');
