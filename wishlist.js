for (let key in g_rgAppInfo) {
  let game = g_rgAppInfo[key];
  
  // find really bad games or games that are no longer sold
  if (game.review_desc.indexOf("Negative") > 1 || (game.subs.length === 0 && game.release_date > new Date().getTime())) {
    console.log(game);
  }
}