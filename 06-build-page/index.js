const fsProm = require("fs/promises");
const fs = require("fs");
const path = require("path");


const newFolderP = path.join(__dirname, "project-dist");
const componentsP = path.join(__dirname, "components");
const templateOriginalP = path.join(__dirname, "template.html");
const templateNewP =path.join(__dirname, "project-dist", "index.html");



 async function cleanAndCreateDir() {
  await fsProm.rm(newFolderP, { force: true, recursive: true });
  await fsProm.mkdir(newFolderP, { recursive: true });

}



 async function createHtml() {

  let componentNameArr =  await fsProm.readdir(componentsP, err => console.log(err))
   componentNameArr = componentNameArr.filter(file => path.extname(file) == '.html')
   
   console.log ( componentNameArr)

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
    console.log ( srt)
    ws.write(srt);
   })
 
   await fsProm.writeFile(templateNewP, srt, "utf8");


 }
 

 const allTogether = async () => {
  try {
    await cleanAndCreateDir();
   await  createHtml();
  } catch (err) {
    console.error(err);
  }
};

allTogether ();