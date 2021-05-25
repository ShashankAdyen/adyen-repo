function makePayment(data){ // Your function calling your server to make the `/payments` request
   return fetch("http://localhost:8000/api/makePayment", { 
       "method": "POST",
       "body": JSON.stringify({
            "merchantAccount" : "TestAccountNY",
            "amount"          : { currency: "USD", value: 1000, },
            "reference"       : "YOUR_ORDER_NUMBER",
            "paymentMethod"   : data.paymentMethod,
            "returnUrl"       : "http://localhost:8000"
       }),
       "headers": {
           "Content-type": "application/json; charset=UTF-8"
       }
   })
   .catch(function(error){
       throw Error(error);
   })
}

function showFinalResult(response){ // Your function to show the final result to the shopper
    alert('You did good lad');
}

function makeDetailsCall(state_dot_data){ // Your function calling your server to make a `/payments/details` request
    return;
}

function onChange(){
    console.log("onChange");
}

function onAdditionalDetails(stateData){
   return fetch("http://localhost:8000/api/payment/details", { 
       "method": "POST",
       "body": JSON.stringify(stateData),
       "headers": {
           "Content-type": "application/json; charset=UTF-8"
        }
   })
   .then(response => response.json())
   .catch(function(error){
      throw Error(error);
   });
}

function onSubmit(state, dropin){
  makePayment(state.data)
    .then(function(response){
      console.log(response.action);
      if (response.action) {
          dropin.handleAction(response.action);
          // handle it??? TODO
      } else {
          showFinalResult(response);
      }
    })
    .catch(error => {
      throw Error(error);
    });
}

let paymentMethodsConfiguration = {
   card: { // Example optional configuration for Cards
     hasHolderName: true,
     holderNameRequired: true,
     enableStoreDetails: true,
     hideCVC: false,
     name: 'Credit or debit card',
     onSubmit: () => {}, // onSubmit configuration for card payments. Overrides the global configuration.
   }
 }

function getPaymentMethods(){
   return fetch("http://localhost:8000/api/getPaymentMethods", { 
       "method": "POST",
       "body": JSON.stringify({
           "merchantAccount": "TestAccountNY"
       }),
       "headers": {
           "Content-type": "application/json; charset=UTF-8"
        }
   })
   .then(response => response.json())
   .catch(function(error){
      throw Error(error);
   });
}

let adyenCheckoutConfiguration = {
    "paymentMethodsResponse"     : null, // To be provided by the API call
    "originKey"                  : "pub.v2.8115650120946270.aHR0cDovL2xvY2FsaG9zdDo4MDAw.zkoVizqsv4uttIICWCxh7zQ8yon0QwaISV5QrztZYE4", // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
    "locale"                     : "en-US",
    "environment"                : "test",
    "onSubmit"                   : onSubmit,
    "onChange"                   : onChange,
    "onAdditionalDetails"        : onAdditionalDetails,
    "paymentMethodsConfiguration": paymentMethodsConfiguration 
};

getPaymentMethods()
    .then(function(response){
        Object.assign(adyenCheckoutConfiguration, {
            "paymentMethodsResponse": response
        });
        const checkout = new AdyenCheckout(adyenCheckoutConfiguration);
        const dropin = checkout.create('dropin', {
                "openFirstPaymentMethod":false
            })
           .mount('#dropin-container');
    })
    .catch(function(error){
        throw Error(error);
    });
