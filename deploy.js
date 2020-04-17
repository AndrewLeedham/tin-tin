const ghpages = require("gh-pages");

ghpages.publish("build", function (e) {
  console.error(e);
});
