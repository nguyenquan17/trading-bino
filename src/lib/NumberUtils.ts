export function formatNumber(price: number, fixed?: number) {
  let n: string = price.toLocaleString("en-US");
  if (fixed && fixed > 0) {
    n = parseFloat(n).toFixed(fixed);
  }
  return n.replaceAll(",", ".");
}


export function add0First(price: number) {
  return (price < 10 ? "0" : "") + price;
}

export function getRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
export function roundToNDecimal(num: number, decimal: number): number {
  const p = Math.pow(10, decimal);
  return Math.round(num * p) / p;
}
