const readline = require('readline');
const fs = require('fs');

const details = {};

const rl = readline.createInterface({
  input: fs.createReadStream('details.txt'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  // skip first line
  if(line.startsWith('MODE')) return;

  // skip empty lines
  if(line.trim().length == 0) return;

  // flatten addressing mode string
  const mode = line.substr(0,12).replace(/[^a-zA-Z0-9]/g,'');
  const instruction = line.substr(14,3);
  const opcode = parseInt(line.substr(33,2),16);
  const bytes = parseInt(line.substr(37,1));
  const cycles = parseInt(line.substr(41,1));

  details[opcode] = {mode: mode, instruction: instruction, bytes: bytes, cycles: cycles};
});

rl.on('close', () => {
  console.log(details);
});
