function makePayment(data){ // Your function calling your server to make the `/payments` request
   console.log('makePayment');
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
   .then(function(response){
       console.log(response);
       return response.json();
   })
   .catch(function(error){
       console.log('uhh');
       throw Error(error);
   });
}

function showFinalResult(response){
    alert('You did good lad, thanks for the moolah');
}

function onChange(){
    console.log("onChange");
}

function onAdditionalDetails(stateData){
   console.log('onAdditionalDetails');
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
  console.log('onSubmit');
  makePayment(state.data)
    .then(function(response){
      if (response.action) {
          console.log('are we... gonna handle it though');
          dropin.handleAction(response.action);
      } else {
          showFinalResult(response);
      }
    })
    .catch(error => {
      throw Error(error);
    });
}

function getPaymentMethods(){
    console.log('getPaymentMethods');
   return fetch("http://localhost:8000/api/getPaymentMethods", { 
       "method": "POST",
       "body": JSON.stringify({
           "merchantAccount": "TestAccountNY"
       }),
       "headers": {
           "Content-type": "application/json; charset=UTF-8"
        }
   })
   .then(function(r){console.log(r); return r})
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
    "onAdditionalDetails"        : onAdditionalDetails
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
