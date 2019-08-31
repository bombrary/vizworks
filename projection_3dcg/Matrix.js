class Matrix {
  constructor(data) {
    this.data = [];
    for (let i = 0; i < data.length; i++) {
      this.data.push(data[i].slice());
    }
  }
  mul(mat) {
    const [l, m, n] = [
      this.data.length, this.data[0].length, mat.data[0].length
    ];
    const res = [];
    for (let i = 0; i < l; i++) {
      res.push([]);
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += this.data[i][k] * mat.data[k][j];
        }
        res[i].push(sum);
      }
    }
    this.data = res;
  }
  transpose() {
    const ret = [];
    const [n, m] = [this.data.length, this.data[0].length];
    for (let i = 0; i < m; i++) {
      ret.push([]);
      for (let j = 0; j < n; j++) {
        ret[i].push(this.data[j][i]);
      }
    }
    return new Matrix(ret);
  }
  copy() {
    const ret = [];
    const [n, m] = [this.data.length, this.data[0].length];
    for (let i = 0; i < n; i++) {
      ret.push(this.data[i].slice());
    }
    return new Matrix(ret);
  }
}

const identityMatrix = (n, m) => {
  const mat =  [];
  for (let i = 0; i < n; i++) {
    mat.push([]);
    for (let j = 0; j < m; j++) {
      mat[i][j] = i === j ? 1 : 0;
    }
  }
  return new Matrix(mat);
};
const translate = (dx, dy, dz) => {
  const ret = identityMatrix(4, 4);
  ret.data[0][3] = dx;
  ret.data[1][3] = dy;
  ret.data[2][3] = dz;
  return ret;
};
const scale = (sx, sy, sz) => {
  const ret = identityMatrix(4, 4);
  ret.data[0][0] = sx;
  ret.data[1][1] = sy;
  ret.data[2][2] = sz;
  return ret;
};
const rotateX = (theta) => {
  const [c, s] = [Math.cos(theta), Math.sin(theta)];
  const ret = identityMatrix(4, 4);
  ret.data[1][1] = c;
  ret.data[1][2] = -s;
  ret.data[2][1] = s;
  ret.data[2][2] = c;
  return ret;
};
const rotateY = (theta) => {
  const [c, s] = [Math.cos(theta), Math.sin(theta)];
  const ret = identityMatrix(4, 4);
  ret.data[0][0] = c;
  ret.data[0][2] = s;
  ret.data[2][0] = -s;
  ret.data[2][2] = c;
  return ret;
};
const rotateZ = (theta) => {
  const [c, s] = [Math.cos(theta), Math.sin(theta)];
  const ret = identityMatrix(4, 4);
  ret.data[0][0] = c;
  ret.data[0][1] = -s;
  ret.data[1][0] = s;
  ret.data[1][1] = c;
  return ret;
};

const mul = (s, t) => {
  const ret = s.copy();
  ret.mul(t);
  return ret;
};

const projectionMatrix = (d) => {
  const ret = identityMatrix(4, 4); 
  ret.data[3][2] = 1/d;
  return ret;
};
