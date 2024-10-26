// Function to set a cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
}

// Your existing code
const siteURL = new URL(location.href);
const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'ttclid', 'li_fat_id', 'twclid'];
const campaignData = {};

for (let i = 0; i < utmParams.length; i++) {
  const paramValue = siteURL.searchParams.get(utmParams[i]);
  if (paramValue) {
    campaignData[utmParams[i]] = paramValue;
  }
}

if (Object.keys(campaignData).length > 0) {
  console.log("Setting cookie: utm_values");
  setCookie('utm_values', JSON.stringify(campaignData), 365); // Store cookie for 365 days
}

