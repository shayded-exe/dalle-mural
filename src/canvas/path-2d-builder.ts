export class Path2DBuilder {
  #path = new Path2D();

  get path(): Path2D {
    return this.#path;
  }

  addPath(path: Path2D, transform?: DOMMatrix2DInit): this {
    this.path.addPath(path, transform);
    return this;
  }

  arc({
    x,
    y,
    radius,
    startAngle,
    endAngle,
    counterclockwise,
  }: {
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    counterclockwise?: boolean;
  }): this {
    this.path.arc(x, y, radius, startAngle, endAngle, counterclockwise);
    return this;
  }

  arcTo({
    x1,
    y1,
    x2,
    y2,
    radius,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    radius: number;
  }): this {
    this.path.arcTo(x1, y1, x2, y2, radius);
    return this;
  }

  bezierCurveTo({
    cp1x,
    cp1y,
    cp2x,
    cp2y,
    x,
    y,
  }: {
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    x: number;
    y: number;
  }): this {
    this.path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    return this;
  }

  closePath(): this {
    this.path.closePath();
    return this;
  }

  ellipse({
    x,
    y,
    radiusX,
    radiusY,
    rotation,
    startAngle,
    endAngle,
    counterclockwise,
  }: {
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
    rotation: number;
    startAngle: number;
    endAngle: number;
    counterclockwise?: boolean;
  }): this {
    this.path.ellipse(
      x,
      y,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle,
      counterclockwise,
    );
    return this;
  }

  lineTo({ x, y }: { x: number; y: number }): this {
    this.path.lineTo(x, y);
    return this;
  }

  moveTo({ x, y }: { x: number; y: number }): this {
    this.path.moveTo(x, y);
    return this;
  }

  quadraticCurveTo({
    cpx,
    cpy,
    x,
    y,
  }: {
    cpx: number;
    cpy: number;
    x: number;
    y: number;
  }): this {
    this.path.quadraticCurveTo(cpx, cpy, x, y);
    return this;
  }

  rect(x: number, y: number, w: number, h: number): this {
    this.path.rect(x, y, w, h);
    return this;
  }
}
