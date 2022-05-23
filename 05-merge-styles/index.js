const fs = require("fs");
const path = require("path");

const stylePath = path.join(__dirname, "styles");
const newBundlePath = path.join(__dirname, "project-dist", "bundle.css");

const ws = fs.createWriteStream(newBundlePath);
fs.readdir(stylePath, (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (path.extname(file) == ".css") {
        const rs = fs.createReadStream(path.join(stylePath, file));
        rs.on("data", function (chunk) {
          ws.write(chunk);
        });
      }
    });
  }
});
