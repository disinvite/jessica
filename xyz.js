var opcodes = require('./opcodes.js');
var fs = require('fs');

const flags = {
  carry: 0,
  zero: 0,
  interrupt:0,
  decimal: 0,
  s:0,
  overflow: 0,
  negative: 0
};

let pc = 0xc000;

const rom = fs.readFileSync('./roms/nestest.nes');

const header = rom.slice(0,16);
console.log(header);
const prg = rom.slice(16,16384 + 16);
console.log(prg);

for(let _x = 0; _x < 5; _x++) {
  let b = prg.readUInt8(pc - 0xc000); // ugh
  console.log(b);
  console.log(opcodes[b]);
}

