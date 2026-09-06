// logger.ts — ANSI Terminal Colors for Professional Output
// 
// ANSI Escape Codes
const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
  bold: "\x1b[1m"
};

const SYMBOLS = {
  success: "✓",
  error: "✗",
  info: "ℹ",
  warning: "⚠"
};

export const logger = {
  success: (msg: string) => console.log(`${COLORS.green}${SYMBOLS.success} ${msg}${COLORS.reset}`),
  error: (msg: string) => console.error(`${COLORS.red}${SYMBOLS.error} ${msg}${COLORS.reset}`),
  warn: (msg: string) => console.warn(`${COLORS.yellow}${SYMBOLS.warning} ${msg}${COLORS.reset}`),
  info: (msg: string) => console.log(`${COLORS.cyan}${SYMBOLS.info} ${msg}${COLORS.reset}`),
  box: (lines: string[]) => {
    const width = 42;
    console.log(`\n${COLORS.cyan}╔${"═".repeat(width)}╗`);
    lines.forEach(line => {
      console.log(`║ ${line.padEnd(width - 1)}║`);
    });
    console.log(`╚${"═".repeat(width)}╝${COLORS.reset}\n`);
  },
  colors: COLORS,
  symbols: SYMBOLS
};
