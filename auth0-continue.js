// Initialize Wized
window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  // Check if the 'code' parameter exists and has a value
  const authCode = Wized.data.n.parameter.code;

  if (authCode) {
    // If code exists, execute the auth0_continue request
    Wized.requests
      .execute("auth0_continue")
      .then((result) => {
        console.log("Auth0 continue request completed:", result);
      })
      .catch((error) => {
        console.error("Error executing auth0_continue request:", error);
      });
  }
});
