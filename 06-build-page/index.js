const fsProm = require("fs/promises");
const fs = require("fs");
const path = require("path");


const newFolderP = path.join(__dirname, "project-dist");
const componentsP = path.join(__dirname, "components");
const templateOriginalP = path.join(__dirname, "template.html");
const templateNewP =path.join(__dirname, "project-dist", "index.html");
const stylesOriginalP = path.join(__dirname, "styles");
const styleNewP = path.join(__dirname, "project-dist", "style.css");
const assetsP = path.join(__dirname, 'assets');
const assetsNewP = path.join(__dirname, "project-dist", 'assets');


 async function cleanAndCreateDir() {
  await fsProm.rm(newFolderP, { force: true, recursive: true });
  await fsProm.mkdir(newFolderP, { recursive: true });
}

 async function createHtml() {
   let componentNameArr = await fsProm.readdir(componentsP, (err) => console.log(err));
   componentNameArr = componentNameArr.filter((file) => path.extname(file) == ".html");

   const rsHTML = fs.createReadStream(templateOriginalP, "utf8");
   const ws = fs.createWriteStream(templateNewP, "utf8");

   rsHTML.on("data", async (chunk) => {
     let srt = chunk;
     for (const elem of componentNameArr) {
       const componentP = path.join(componentsP, elem);
       const component = await fsProm.readFile(componentP);
       const baseName = path.basename(elem, ".html");
       srt = srt.replace(`{{${baseName}}}`, component);
     }
     ws.write(srt);
   });
 }
 
 async function createCSS() {
   let styleNameArr = await fsProm.readdir(stylesOriginalP, (err) =>console.log(err));
   styleNameArr = styleNameArr.filter((file) => path.extname(file) == ".css");

   const ws = fs.createWriteStream(styleNewP, "utf8");
   for (const elem of styleNameArr) {
     const styleP = path.join(stylesOriginalP, elem);
     const rsCSS = fs.createReadStream(styleP, "utf8");
     rsCSS.on("data", async (chunk) => {
       ws.write(chunk);
     });
   }
 }
 
 async function cleanDir() {
  await fsProm.rm(assetsNewP, { force: true, recursive: true });
  await fsProm.mkdir(assetsNewP, { recursive: true });
}

async function copyAssets(newP, oldP) {
  await fsProm.mkdir(newP, { recursive: true });
  const files = await fsProm.readdir(oldP);

console.log(files)

  for (let file of files) {
    const assetsFile = path.join(oldP, file);
    const assetsNewFile = path.join(newP, file);
    const stat = await fsProm.stat(assetsFile);
    if (stat.isDirectory()) {
      copyAssets(assetsNewFile, assetsFile);
    } else {
      await fsProm.copyFile(assetsFile, assetsNewFile);
    }

  }

}

async function allTogether() {
  try {
   await cleanAndCreateDir();
   await  createHtml();
   await createCSS();
   await copyAssets(assetsNewP, assetsP);
  } catch (err) {
    console.error(err);
  }
};

allTogether ();