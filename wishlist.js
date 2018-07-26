// loop over embedded game list
for (let key in g_rgAppInfo) {
  let game = g_rgAppInfo[key];
  
  // find really bad games or games that are no longer sold
  if (game.review_desc.match(/^(?:Very|Overwhelmingly) Negative$/) || (game.subs.length === 0 && game.release_date > new Date().getTime())) {
    // get game id from url property
    let appid = parseInt(game.capsule.match(/[0-9]+(?=\/header)/)[0]);

    // send post request with IDs
    fetch("remove/", {
      method: "POST",
      credentials: "same-origin", // for cookie
      body: new URLSearchParams(`appid=${appid}&sessionid=${g_sessionID}`)
    }).then(function() {
      console.log(`${game.name} removed`);
    });
  }
}