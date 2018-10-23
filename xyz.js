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

// these aren't the right reset flags

let pc = 0xc000;

const rom = fs.readFileSync('./roms/nestest.nes');

const header = rom.slice(0,16);
console.log(header);
const prg = rom.slice(16,16384 + 16);
console.log(prg);

function prg_read(addr) {
  return prg.readUInt8(addr - 0xc000); // ugh
}

function prg_read_16(addr) {
  return prg.readUInt16BE(addr - 0xc000); // ugh
}

for(let _x = 0; _x < 5; _x++) {
  let b = prg_read(pc); // ugh
  let opcode = opcodes[b];
  let address;
  switch(opcode.mode) {
    case 'Absolute':
      address = prg_read_16(pc + 1);
      break;
  }

  console.log(address.toString(16));

}

