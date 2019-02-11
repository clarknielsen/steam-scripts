fetch("https://steamcommunity.com/market/mylistings/render/?query=&start=0&count=500", {
  credentials: "same-origin" // for cookie
}).then(function(response) {
  response.json().then(function(data) {
    // convert response to dom object
    let doc = new DOMParser().parseFromString(data.results_html, "text/html");

    let items = doc.querySelectorAll("div.market_listing_row");

    for (let i = 0; i < items.length; i++) {
      // use link to get app data
      let url = items[i].querySelector(".market_listing_item_name_link").getAttribute("href").split("/");
      let appid = url[url.length-2];
      let market_hash = url[url.length-1];

      // find price set by me
      let myPrice = parseFloat(items[i].querySelector(".market_listing_price span span:first-child").textContent.trim().replace("$", ""));

      // follow-up api
      fetch(`https://steamcommunity.com/market/priceoverview/?country=US&urrency=1&appid=${appid}&market_hash_name=${market_hash}`, {
        credentials: "same-origin"
      }).then(function(response) {
        response.json().then(function(data) {
          // get their price
          let price = parseFloat(data.lowest_price.replace("$", ""));

          // if my price is too high, cancel listing
          if (myPrice - .05 > price) {
            let listid = items[i].className.replace("market_listing_row market_recent_listing_row listing_", "");

            fetch("https://steamcommunity.com/market/removelisting/" + listid, {
              method: "POST",
              credentials: "same-origin",
              body: new URLSearchParams("sessionid=" + g_sessionID)
            }).then(function() {
              console.log("item removed");
            });
          }
        });
      });
    }
  });
});