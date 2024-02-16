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
