const fs = require("fs/promises");
const path = require("path");

const myWay = path.join(__dirname, "files");
const myNewWay = path.join(__dirname, "files-copy");

async function cleanDir() {
  await fs.rm(myNewWay, { force: true, recursive: true });
  await fs.mkdir(myNewWay, { recursive: true });
}

async function copyDir() {
  await cleanDir();
 

  let files = await fs.readdir(myWay, { withFileTypes: true });

  for (let file of files) {
    await fs.copyFile(
      path.join(myWay, file.name),
      path.join(myNewWay, file.name)
    );
  }
}
copyDir();
