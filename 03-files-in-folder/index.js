const fs = require("fs");
const path = require("path");
const myWay = path.join(__dirname, "secret-folder", "");

fs.readdir(myWay, function (err, items) {
  for (let i = 0; i < items.length; i++) {
    let n = items[i];
    fs.stat(`${myWay}\\${n}`, function (err, stats) {
      if (stats.isFile()) {
        console.log( path.parse(`${n}`).name + " - " + path.extname(`${n}`).substr(1) + " - " + `${stats.size}` +"B");
      }
    });
  }
});