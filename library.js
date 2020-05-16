for (let i = 0; i < rgGames.length; i++) {
  let game = rgGames[i];

  fetch(game.link).then(function(response) {
    response.text().then(function(data) {
      if (data.indexOf("<span>Store Page</span>") === -1) {
        console.log(`${game.name_escaped} has been de-listed.`);
      }
    });
  })
  .catch(function(err) {
    console.log(`${game.name_escaped} has been de-listed.`);
  });
}
