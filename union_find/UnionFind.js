class UnionFind {
  constructor(V, gedit) {
    this.par = [...Array(V)].map((d, i) => i);
    this.rnk = [...Array(V)].fill(1);
    this.linkId = {};

    this.gedit = gedit;
    gedit.initGraph();
    for (let i = 0; i < V; i++) {
      this.addNode(i);
      this.addLink(i, i);
    }
    gedit.restart();
  }
  unite(i, j) {
    [i, j] = [this.find(i), this.find(j)];
    if (i === j) return;
    if (this.rnk[i] > this.rnk[j]) {
      this.par[j] = i;
      this.removeLink(j, j);
      this.addLink(j, i);
    } else {
      this.par[i] = j;
      if (this.rnk[i] === this.rnk[j]) {
        this.rnk[j]++;
      }
      this.removeLink(i, i);
      this.addLink(i, j);
    }
    this.gedit.restart();
  }
  find(i) {
    if (this.par[i] === i) return i;
    const prev_p = this.par[i];
    const p = this.find(this.par[i]);
    if (p !== prev_p) {
      this.removeLink(i, prev_p);
      this.addLink(i, p);
      this.gedit.restart();
      this.par[i] = p;
    }
    return p;
  }
  same(i, j) {
    return this.find(i) === this.find(j);
  }

  addNode(i) {
    this.gedit.addNode({label: i});
    this.linkId[i] = {};
  }
  addLink(i, j) {
    const id = this.gedit.addLink({source: i, target: j});
    this.linkId[i][j] = id;
  }
  removeLink(i, j) {
    const id = this.linkId[i][j];
    this.gedit.removeLink(id);
    delete this.linkId[i][j];
  }
}
