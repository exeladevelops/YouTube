export function getSeconds(str: string): number {
  let p = str.split(":"),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop() as string, 10);
    m *= 60;
  }

  return s;
}
