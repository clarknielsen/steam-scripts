function searchEmUp(page) {
  fetch("https://store.steampowered.com/search/?sort_by=Released_DESC&category1=998&supportedlang=english&page=" + page, {
    credentials: "same-origin" // for cookie
  }).then(function(response) {
    response.text().then(function(data) {
      // convert response to dom object
      let doc = new DOMParser().parseFromString(data, "text/html");
      
      let games = doc.querySelectorAll("a.search_result_row");
      let foundOne = false;

      let today = new Date();

      for (let i = 0; i < games.length; i++) {
        // check for games that aren't free and aren't VR
        if (games[i].querySelector(".col.search_price").textContent.indexOf("$") !== -1 && !games[i].querySelector(".platform_img.hmd_separator")) {
          // format release date
          let release = new Date(`${games[i].querySelector(".col.search_released").textContent} ${today.getHours()}:${today.getMinutes()}:00`);

          // and compare to today (one day ago)
          if (today.getTime() - release.getTime() <= 24 * 60 * 60 * 1000) {
            foundOne = true;

            // open in new tab
            window.open(games[i].getAttribute("href"));
          }
        }
      }

      // if still finding new games, continue to next page
      if (foundOne) {
        searchEmUp(page+1);
      }
    });
  });
}

// start script at page 1
searchEmUp(1);