fetch("https://steamcommunity.com/inventory/" + g_steamID + "/753/6?l=english&count=5000", {
  credentials: "same-origin" // for cookie
}).then(function(response) {
  response.json().then(async function(data) {
    // loop over all inventory items
    for (let i = 0; i < data.descriptions.length; i++) {
      let item = data.descriptions[i];

      if (item.marketable !== 1) continue;

      // follow-up api
      await fetch(`https://steamcommunity.com/market/listings/${item.appid}/${item.market_hash_name}`, {
        credentials: "same-origin"
      }).then(function(response) {
        response.text().then(function(data) {
          // scrape for last price sold
          let history = JSON.parse(data.match(/(var line1=)(.*)(;)/)[2]);
          let price = history[history.length-1][1];

          if (price >= .1) {
            console.log(`${item.name} sells for $${price}`);
          }
        });
      });
    }
  });
});
