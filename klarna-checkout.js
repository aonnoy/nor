window.klarnaAsyncCallback = function() {
    try {
        // Retrieve client_token from localStorage
        var clientToken = localStorage.getItem('klarna-client-token');
        if (!clientToken) {
            console.error('Client token not found in localStorage');
            return;
        }

        // Initialize Klarna Payments with the client_token
        Klarna.Payments.init({
            client_token: clientToken // Retrieved from localStorage
        });

        // Retrieve plan_id from localStorage
        var planId = localStorage.getItem('klarna-plan-id');

        // Load the payment method widget
        Klarna.Payments.load(
            {
                container: '#klarna-payments-container',
                payment_method_category: 'pay_now' // Adjust as needed
            },
            {},
            function(res) {
                if (res.show_form) {
                    console.log("Klarna payment form displayed successfully");
                    // No need for height adjustment
                } else {
                    console.error("Failed to display Klarna payment form", res.error);
                }
            }
        );

        // Handle the authorization when the user clicks the 'Submit Payment' button
        document.getElementById('authorize-button').addEventListener('click', function() {
            // Disable the button to prevent multiple clicks
            document.getElementById('authorize-button').disabled = true;

            // Retrieve plan_id from localStorage again, in case it has changed
            var planId = localStorage.getItem('klarna-plan-id');

            // Authorize the payment
            Klarna.Payments.authorize(
                {
                    payment_method_category: 'pay_now' // Ensure this matches the category used in load()
                },
                {
                    // Include plan_id in the authorization data sent to Klarna
                    // Note: Klarna may not return this in the response
                    plan_id: planId
                },
                function(response) {
                    if (response.approved) {
                        // Payment was authorized successfully

                        // Attach plan_id to the response object
                        response.plan_id = planId;

                        // Send the response and plan_id to your backend for further processing
                        sendAuthorizationDataToBackend(response);

                        // Update the UI or redirect the user as needed
                        console.log('Payment authorized successfully.');
                    } else {
                        // Handle errors or rejections
                        console.error('Payment authorization failed:', response);

                        // Re-enable the button if authorization failed
                        document.getElementById('authorize-button').disabled = false;
                    }
                }
            );
        });

        // Function to send the authorization data to your backend
        function sendAuthorizationDataToBackend(authorizationResponse) {
            // Your backend endpoint that handles the authorization data
            var backendEndpointUrl = 'https://backend.norcommunity.com/api:08RmoMpl/membership/klarna-checkout/klarna-subscription-created';

            // Retrieve auth_token from cookies
            function getCookie(name) {
                var value = "; " + document.cookie;
                var parts = value.split("; " + name + "=");
                if (parts.length == 2) return parts.pop().split(";").shift();
            }

            var authToken = getCookie('auth_token');

            // Use the Fetch API to send a POST request to your backend
            fetch(backendEndpointUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
                body: JSON.stringify(authorizationResponse)
            })
                .then(function(response) {
                    if (response.ok) {
                        // Handle the response from your backend
                        console.log('Authorization data sent to backend successfully.');

                        // Redirect the user to the success page
                        window.location.href = '/membership/subscription-successful-klarna';
                    } else {
                        // Handle errors from the backend
                        console.error('Error sending authorization data to backend:', response.statusText);

                        // Re-enable the button if sending data failed
                        document.getElementById('authorize-button').disabled = false;
                    }
                })
                .catch(function(error) {
                    // Handle network or other errors
                    console.error('Network error:', error);

                    // Re-enable the button if network error occurred
                    document.getElementById('authorize-button').disabled = false;
                });
        }

    } catch (e) {
        console.error("Error initializing Klarna", e);
    }
};
