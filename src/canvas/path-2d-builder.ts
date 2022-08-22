export class Path2DBuilder {
  #path = new Path2D();

  get path(): Path2D {
    return this.#path;
  }

  addPath(...args: Parameters<Path2D['addPath']>): this {
    this.path.addPath(...args);
    return this;
  }

  arc(...args: Parameters<Path2D['arc']>): this {
    this.path.arc(...args);
    return this;
  }

  arcTo(...args: Parameters<Path2D['arcTo']>): this {
    this.path.arcTo(...args);
    return this;
  }

  bezierCurveTo(...args: Parameters<Path2D['bezierCurveTo']>): this {
    this.path.bezierCurveTo(...args);
    return this;
  }

  closePath(): this {
    this.path.closePath();
    return this;
  }

  ellipse(...args: Parameters<Path2D['ellipse']>): this {
    this.path.ellipse(...args);
    return this;
  }

  lineTo(...args: Parameters<Path2D['lineTo']>): this {
    this.path.lineTo(...args);
    return this;
  }

  moveTo(...args: Parameters<Path2D['moveTo']>): this {
    this.path.moveTo(...args);
    return this;
  }

  quadraticCurveTo(...args: Parameters<Path2D['quadraticCurveTo']>): this {
    this.path.quadraticCurveTo(...args);
    return this;
  }

  rect(...args: Parameters<Path2D['rect']>): this {
    this.path.rect(...args);
    return this;
  }

  // extra

  circle(x: number, y: number, radius: number): this {
    return this.arc(x, y, radius, 0, 2 * Math.PI);
  }
}
