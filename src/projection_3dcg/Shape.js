class Shape {
  constructor(vertex, edge) {
    this.vertex = vertex;
    this.edge = edge;
  }
  translate(dx, dy, dz) {
    this.vertex.forEach((v, i) => {
      v[0] += dx;
      v[1] += dy;
      v[2] += dz;
    });
  }
  scale(sx, sy, sz) {
    this.vertex.forEach(v => {
      v[0] *= sx;
      v[1] *= sy;
      v[2] *= sz;
    });
  }
  pushVertex(v) {
    this.vertex.push(v);
  }
  rotateX(theta) {
    const [c, s] = [Math.cos(theta), Math.sin(theta)];
    this.vertex.forEach(v => {
      const newY = c*v[1] - s*v[2];
      const newZ = s*v[1] + c*v[2];
      [v[1], v[2]] = [newY, newZ];
    });
  }
  rotateY(theta) {
    const [c, s] = [Math.cos(theta), Math.sin(theta)];
    this.vertex.forEach(v => {
      const newX = c*v[0] - s*v[2];
      const newZ = s*v[0] + c*v[2];
      [v[0], v[2]] = [newX, newZ];
    });
  }
  rotateZ(theta) {
    const [c, s] = [Math.cos(theta), Math.sin(theta)];
    this.vertex.forEach(v => {
      const newX = c*v[0] - s*v[1];
      const newY = s*v[0] + c*v[1];
      [v[0], v[1]] = [newX, newY];
    });
  }
}
