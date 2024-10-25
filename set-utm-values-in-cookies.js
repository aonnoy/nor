	const siteURL = new URL(location.href)
    var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'ttclid', 'li_fat_id', 'twclid'];
  var campaignData = {};

    for (var i = 0; i < utmParams.length; i++) {
      var paramValue = siteURL.searchParams.get(utmParams[i])
      if (paramValue) {
        campaignData[utmParams[i]] = paramValue;
      }
    }

    if (Object.keys(campaignData).length > 0) {
      console.log("Setting cookie: utm_values");
      setCookie('utm_values', JSON.stringify(campaignData), 365); // Store cookie for 365 days
    }
