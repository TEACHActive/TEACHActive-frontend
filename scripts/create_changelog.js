const fs = require("fs");
const generateChangelog = require("../src/generateChangelog.js")
  .generateChangelog;

var changelog = fs.readFileSync("../src/changelog.json", "utf8");
const changelogJSON = JSON.parse(changelog);

fs.writeFileSync("../src/CHANGELOG.md", generateChangelog(changelogJSON));
