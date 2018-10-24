var opcodes = require('./opcodes.js');
var fs = require('fs');

require('string.prototype.padstart').shim();
require('string.prototype.padend').shim();

const jmp_table = {
  "ADC": op_adc, "AND": op_and, "ASL": op_asl, "BCC": op_bcc, "BCS": op_bcs,
  "BEQ": op_beq, "BIT": op_bit, "BMI": op_bmi, "BNE": op_bne, "BPL": op_bpl,
  "BRK": op_brk, "BVC": op_bvc, "BVS": op_bvs, "CLC": op_clc, "CLD": op_cld,
  "CLI": op_cli, "CLV": op_clv, "CMP": op_cmp, "CPX": op_cpx, "CPY": op_cpy,
  "DEC": op_dec, "DEX": op_dex, "DEY": op_dey, "EOR": op_eor, "INC": op_inc,
  "INX": op_inx, "INY": op_iny, "JMP": op_jmp, "JSR": op_jsr, "LDA": op_lda,
  "LDX": op_ldx, "LDY": op_ldy, "LSR": op_lsr, "NOP": op_nop, "ORA": op_ora,
  "PHA": op_pha, "PHP": op_php, "PLA": op_pla, "PLP": op_plp, "ROL": op_rol,
  "ROR": op_ror, "RTI": op_rti, "RTS": op_rts, "SBC": op_sbc, "SEC": op_sec,
  "SED": op_sed, "SEI": op_sei, "STA": op_sta, "STX": op_stx, "STY": op_sty,
  "TAX": op_tax, "TAY": op_tay, "TSX": op_tsx, "TXA": op_txa, "TXS": op_txs,
  "TYA": op_tya
};

let flags = 0x24; //?
let cycles = 0;

const regs = {
  a: 0,
  x: 0,
  y: 0,
  sp: 0xFD
}

// flags
// 7654 3210
// NVss DIZC
// 0010 0100  == 0x24
// 0011 0100  == 0x34

function set_flag_carry(v)     { if(v) { flags |= 0x01; } else { flags &= 0xFE } }
function set_flag_zero(v)      { if(v) { flags |= 0x02; } else { flags &= 0xFD } }
function set_flag_interrupt(v) { if(v) { flags |= 0x04; } else { flags &= 0xFB } }
function set_flag_decimal(v)   { if(v) { flags |= 0x08; } else { flags &= 0xF7 } }
function set_flag_overflow(v)  { if(v) { flags |= 0x40; } else { flags &= 0xBF } }
function set_flag_negative(v)  { if(v) { flags |= 0x80; } else { flags &= 0x7F } }

function get_flag_carry()     { return (flags & 0x01) ? 1 : 0; }
function get_flag_zero()      { return (flags & 0x02) ? 1 : 0; }
function get_flag_interrupt() { return (flags & 0x04) ? 1 : 0; }
function get_flag_decimal()   { return (flags & 0x08) ? 1 : 0; }
function get_flag_overflow()  { return (flags & 0x40) ? 1 : 0; }
function get_flag_negative()  { return (flags & 0x80) ? 1 : 0; }

// these aren't the right reset flags

let pc = 0xc000; // for nestest.nes automated tests

const rom = fs.readFileSync('./roms/nestest.nes');
const header = rom.slice(0,16);
const prg = rom.slice(16,16384 + 16);

function mem_read(addr) {
  if((addr >= 0x8000) && (addr < 0xc000)) {
    return prg.readUInt8(addr - 0x8000);
  } else {
    return prg.readUInt8(addr - 0xc000);
  }
}

function mem_read_16(addr) {
  if((addr >= 0x8000) && (addr < 0xc000)) {
    return prg.readUInt16LE(addr - 0x8000);
  } else {
    return prg.readUInt16LE(addr - 0xc000);
  }
}

function debug_prg_read(addr,n) {
  if(n == 0) return;
  let start = addr - 0xc000;
  return prg.slice(start, start + n);
}

// a horrible nightmare.
function debug_print(opcode, address) {
  const _hex = (x,n) => x.toString(16).padStart(n,'0').toUpperCase()

  let _pc = pc.toString(16).toUpperCase();
  let _bytes = debug_prg_read(pc,opcode.bytes);
  let _bytes_arr = [..._bytes];
  let _byte_str = _bytes_arr.map((x) => _hex(x,2)).join(' ').padEnd(42,' ');
  let _regs_str = `A:${_hex(regs.a,2)} X:${_hex(regs.x,2)} Y:${_hex(regs.y,2)} P:${_hex(flags,2)} SP:${_hex(regs.sp,2)} CYC:${cycles.toString().padStart(3,' ')}`

  console.log(`${_pc} ${_byte_str} ${_regs_str}`);
}

for(let _x = 0; _x < 5; _x++) {
  let b = mem_read(pc);
  let opcode = opcodes[b];
  let address;
  switch(opcode.mode) {
    case 'Absolute':
      address = mem_read_16(pc + 1);
      break;
    case 'Immediate':
      address = pc + 1;
      break;
  }

  let args = {addr: address};
  let opcode_fn = jmp_table[opcode.instruction];

  debug_print(opcode,address);
  pc += opcode.bytes;
  cycles += 3 * opcode.cycles;
  opcode_fn(args);
}


function op_adc(args) { }
function op_and(args) { }
function op_asl(args) { }
function op_bcc(args) { }
function op_bcs(args) { }
function op_beq(args) { }
function op_bit(args) { }
function op_bmi(args) { }
function op_bne(args) { }
function op_bpl(args) { }
function op_brk(args) { }
function op_bvc(args) { }
function op_bvs(args) { }
function op_clc(args) { }
function op_cld(args) { }
function op_cli(args) { }
function op_clv(args) { }
function op_cmp(args) { }
function op_cpx(args) { }
function op_cpy(args) { }
function op_dec(args) { }
function op_dex(args) { }
function op_dey(args) { }
function op_eor(args) { }
function op_inc(args) { }
function op_inx(args) { }
function op_iny(args) { }

function op_jmp(args) {
  pc = args.addr;
}

function op_jsr(args) { }
function op_lda(args) { }
function op_ldx(args) {
  regs.x = mem_read(args.addr);
  set_flag_zero(regs.x == 0);
}

function op_ldy(args) { }
function op_lsr(args) { }
function op_nop(args) { }
function op_ora(args) { }
function op_pha(args) { }
function op_php(args) { }
function op_pla(args) { }
function op_plp(args) { }
function op_rol(args) { }
function op_ror(args) { }
function op_rti(args) { }
function op_rts(args) { }
function op_sbc(args) { }
function op_sec(args) { }
function op_sed(args) { }
function op_sei(args) { }
function op_sta(args) { }
function op_stx(args) { }
function op_sty(args) { }
function op_tax(args) { }
function op_tay(args) { }
function op_tsx(args) { }
function op_txa(args) { }
function op_txs(args) { }
function op_tya(args) { }

