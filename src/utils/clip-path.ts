export function getTrapezoidClipPath({
  top = 100,
  right = 100,
  bottom = 100,
  left = 100,
}: {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}): string {
  const top1 = 50 - top / 2;
  const top2 = 100 - top1;
  const right1 = 50 - right / 2;
  const right2 = 100 - right1;
  const bottom1 = 50 - bottom / 2;
  const bottom2 = 100 - bottom1;
  const left1 = 50 - left / 2;
  const left2 = 100 - left1;

  return `
    polygon(
      ${top1}% ${left1}%, ${top2}% ${right1},
      ${bottom2}% ${right2}%, ${bottom1}% ${left2}%
    );`;
}
