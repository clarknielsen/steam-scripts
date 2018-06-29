fetch("https://steamcommunity.com/inventory/" + g_steamID + "/753/6?l=english&count=5000", {
  credentials: "same-origin" // for cookie
}).then(function(response) {
  response.json().then(function(data) {
    var map = {};

    // loop over all inventory items
    for (let i = 0; i < data.descriptions.length; i++) {
      let card = data.descriptions[i];

      // check if is card and is gem-able
      if (card.type.indexOf("Trading Card") !== -1 && card.owner_actions[1] && card.owner_actions[1].name.indexOf("Gems") !== -1) {
        // store unique game/card details in map object
        if (!map[card.type]) {
          map[card.type] = {
            lastClassId: card.classid,
            name: card.type,
            id: card.market_fee_app,
            count: 0,
            value: 0,
            item_type: parseInt(card.owner_actions[1].link.split(", ")[3])
          };
        }
        else {
          // sometimes the same card appears more than once, so skip repeats
          if (card.classid === map[card.type].lastClassId) {
            continue;
          }
          else {
            map[card.type].lastClassId = card.classid;
          }
        }

        // find all instances of this card in the master "assets" array
        for (let j = 0; j < data.assets.length; j++) {
          if (data.assets[j].classid === card.classid) {
            map[card.type].count++;
          }
        }
      }
    }

    // convert back to array
    var cards = [];

    for (let key in map) {
      cards.push(map[key]);
    }

    console.log(cards.length + " cards to goo...");

    // get gem value one by one
    let i = 0;
    gemmy();

    function gemmy() {
      fetch("https://steamcommunity.com/auction/ajaxgetgoovalueforitemtype/?appid=" + cards[i].id + "&item_type="+ cards[i].item_type).then(function(response) {
        response.json().then(function(data) {
          cards[i].value = parseInt(data.goo_value);

          // foil cards are worth more
          if (cards[i].name.indexOf("Foil") !== -1) {
            cards[i].value*=10;
          }

          if (i < cards.length-1) {
            i++;
            gemmy();
          }
          else {
            cards.sort(function(a, b){return b.value - a.value});
            console.log(cards);
          }
        });
      });
    }
  });
});
