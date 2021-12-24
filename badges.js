// find all badges on page
var rows = document.querySelectorAll(".badge_row");
var badges = [];
var fetched = 0;

for (let i = 0; i < rows.length; i++) {
  // check how many cards are left in each set
  let amount = rows[i].querySelector(".badge_progress_info").innerText.split(" ");

  // skip sets that aren't even close
  if (parseInt(amount[0])/parseInt(amount[2]) > .5) {
    // add to master list
    badges.push({
      name: rows[i].querySelector(".badge_title").innerText.trim(),
      link: rows[i].querySelector(".badge_row_overlay").getAttribute("href"),
      cost: 0
    });
  }
}

console.log(badges.length + " badges to fetch...");

for (let i = 0; i < badges.length; i++) {
  // scrape individual badge pages
  fetch(badges[i].link, {
    credentials: "same-origin" // for cookie
  }).then(function(response) {
    response.text().then(function(data) {
      // convert response to dom object
      let doc = new DOMParser().parseFromString(data, "text/html");

      // find link to "buy remaining" page and scrape it
      let url = doc.querySelector(".badge_cards_to_collect .gamecards_inventorylink a").getAttribute("href").replace("community.akamai.steamstatic.com", "steamcommunity.com");

      fetch(url, {
        credentials: "same-origin"
      }).then(function(response) {
        response.text().then(function(data) {
          // dom
          let doc = new DOMParser().parseFromString(data, "text/html");

          // find cards flagged as needing to buy
          let inputs = doc.querySelectorAll(".market_dialog_input.market_multi_quantity[value='1']");
          
          for (let j = 0; j < inputs.length; j++) {
            // from there, find input that contains dollar value and add to total cost
            badges[i].cost += parseFloat(inputs[j].parentNode.parentNode.querySelector(".market_dialog_input.market_multi_price").value.substr(1));
          }

          // check if we've finished scraping all pending badges
          fetched++;

          if (fetched === badges.length) {
            badges.sort(function(a, b){return a.cost - b.cost});
            console.log(badges);
          }
        });
      });
    });
  });
}
