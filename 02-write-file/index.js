const fs = require('fs');
const path = require('path');
const process = require('process');

const myWay = path.join(__dirname,  'test.txt');

const stream = fs.createWriteStream(myWay);

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.write('Пишите информацию:\n');

function exitMassage() {
  rl.write('Конец информации!');
  process.exit(0);
}

rl.on('line', (line) => {
  if (line === 'exit') {
    exitMassage();
  }
  stream.write(line + '\n');
});



rl.on('close', exitMassage);