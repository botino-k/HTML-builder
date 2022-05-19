const fs = require('fs');
const path = require('path');
const process = require('process');

const myWay = path.join(__dirname,  'test.txt');

const stream = fs.createWriteStream(myWay);

const myConsole = new console.Console(stream);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.on('line', (line) => {
  if(line!='exit'){
  myConsole.log(line)
}if(line =='exit'){
  process.exit();}
});

readline.question('Пишите информацию\n', (name) => {
  myConsole.log(name) 
});

process.on('exit', () => console.log('\nДо встречи!'));