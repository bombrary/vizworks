class UnionFind {
  constructor(n, m) {
    this.par = new Object(n);
    this.n = n;
    this.m = m;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        this.par[[i, j]] = [-1, -1];
      }
    }
  }
  find(p) {
    if (this.par[p][0] < 0) return p 
    return this.par[p] = this.find(this.par[p]);
  }
  unite(p, q) {
    [p, q] = [this.find(p), this.find(q)];
    if (p.toString() === q.toString()) return;
    const [psize, qsize] = [-this.par[p][0], -this.par[q][0]];
    if (psize < qsize) {
      this.par[q][0] += this.par[p][0];
      this.par[p] = q;
    } else {
      this.par[p][0] += this.par[q][0];
      this.par[q] = p;
    }
  }
  same(i, j) {
    return this.find(i) === this.find(j);
  }
  size(i) {
    i = this.find(i);
    return -this.par[i];
  }
  check() {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.m; j++) {
        if (this.par[[i, j]].length === 3) {
          throw '3 elems!';
        }
      }
    }
  }
}

