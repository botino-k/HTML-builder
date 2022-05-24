const fsProm = require("fs/promises");
const fs = require("fs");
const path = require("path");


const newFolderP = path.join(__dirname, "project-dist");
const componentsP = path.join(__dirname, "components");
const templateOriginalP = path.join(__dirname, "template.html");
const templateNewP =path.join(__dirname, "project-dist", "index.html");
const stylesOriginalP = path.join(__dirname, "styles");
const styleNewP = path.join(__dirname, "project-dist", "style.css");


 async function cleanAndCreateDir() {
  await fsProm.rm(newFolderP, { force: true, recursive: true });
  await fsProm.mkdir(newFolderP, { recursive: true });
}

 async function createHtml() {

  let componentNameArr =  await fsProm.readdir(componentsP, err => console.log(err))
   componentNameArr = componentNameArr.filter(file => path.extname(file) == '.html')
   
   const rsHTML = fs.createReadStream(templateOriginalP, "utf8");
   const ws = fs.createWriteStream(templateNewP, "utf8");

   rsHTML.on('data', async (chunk) => {
    //console.log ( chunk)
   let srt =chunk
    for (const elem of componentNameArr) {
      const componentP = path.join(componentsP, elem);
      const component = await fsProm.readFile(componentP);
      const baseName = path.basename(elem, '.html');
     srt = srt.replace(`{{${baseName}}}`, component);
    }
    //console.log ( srt)
   ws.write(srt);
  
   })
  // await fsProm.writeFile(templateNewP, srt, "utf8");
 }
 
 async function createCSS() {

  let styleNameArr = await fsProm.readdir(stylesOriginalP, err => console.log(err))
  styleNameArr = styleNameArr.filter(file => path.extname(file) == '.css')
  console.log(styleNameArr);

  const ws = fs.createWriteStream(styleNewP, 'utf8');
    for (const elem of styleNameArr) {
      const styleP = path.join(stylesOriginalP, elem);
      const rsCSS = fs.createReadStream(styleP, "utf8");
      rsCSS.on("data", async (chunk) => {  ws.write(chunk);});
    }
 }
 











 const allTogether = async () => {
  try {
    await cleanAndCreateDir();
   await  createHtml();
   await createCSS()
  } catch (err) {
    console.error(err);
  }
};

allTogether ();