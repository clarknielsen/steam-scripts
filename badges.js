var rows = document.querySelectorAll(".badge_row");
var badges = [];

for (let i = 0; i < rows.length; i++) {
  let amount = rows[i].querySelector(".badge_progress_info").innerText.split(" ");

  // skip sets that aren't even close
  if (parseInt(amount[0])/parseInt(amount[2]) > .7) {
    badges.push({
      name: rows[i].querySelector(".badge_title").innerText.trim(),
      link: rows[i].querySelector(".badge_row_overlay").getAttribute("href")
    });
  }
}

for (let i = 0; i < badges.length; i++) {
  fetch(badges[i].link, {
    credentials: "same-origin" // for cookie
  }).then(function(response) {
    response.text().then(function(data) {
      var doc = new DOMParser().parseFromString(data, "text/html");

      console.log(badges[i].link, doc.querySelector(".gamecards_inventorylink a").getAttribute("href"));
    });
  });
}