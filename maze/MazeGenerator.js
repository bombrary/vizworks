"use strict"

class MazeGenerator {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.di = [-1, 0, 1, 0];
    this.dj = [0, 1, 0, -1];
    this.candToMove = [0, 1, 2, 3];
  }
  generate(sy, sx) {
    const map = [...Array(this.height)].map(() =>
      new Array(this.height).fill('#')
    );
    this.dig(map, sy, sx);
    return map;
  }
  dig(map, i, j) {
    map[i][j] = '.';
    for (let k of d3.shuffle(this.candToMove)) {
      const [ni, nj] = [i + this.di[k], j + this.dj[k]];
      if (this.isValid(map, ni, nj)
       && this.isValid(map, ni + this.di[k], nj + this.dj[k])) {
        map[ni][nj] = '.';
        this.dig(map, ni + this.di[k], nj + this.dj[k]);
      }
    }
  }
  isValid(map, i, j) {
    if (i < 0 || i >= this.height) return false;
    if (j < 0 || j >= this.width) return false;
    if (map[i][j] === '.') return false;
    return true;
  }
}
