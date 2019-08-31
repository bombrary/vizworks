'use strict'

class HistoryOfSegtree {
  constructor() {
    this.data = [];
  }
  push(st) {
    let datum = {node: [], col: []};
    st.node.forEach((d, i) => datum.node[i] = d);
    st.col.forEach((d, i) => datum.col[i] = d);
    this.data.push(datum);
  }
  clear() {
    this.data.length = 0;
  }
}

class segtree {
  constructor(sz) {
    let n = 1;
    while (n < sz) n *= 2;
    this.node = new Array(2*n - 1).fill(0);
    this.col = new Array(2*n - 1).fill('white');
    this.n = n;
    this.hist = new HistoryOfSegtree();
  }

  update(i, val) {
    this.hist.clear();
    this.col = new Array(2*this.n - 1).fill('white');

    i += this.n - 1;
    this.node[i] = val;
    this.col[i] = 'lightgreen';
    this.hist.push(this);
    while (i > 0) {
      i = Math.floor((i - 1) / 2);
      this.node[i] = this.node[2*i + 1] + this.node[2*i + 2];
      this.col[i] = 'lightgreen';
      this.hist.push(this);
    }
  }

  _getsum(tl, tr, k, l, r) {
    if (r <= tl || tr <= l) {
      this.col[k] = 'salmon';
      this.hist.push(this);
      return 0;
    } else if (tl <= l && r <= tr) {
      this.col[k] = 'lightgreen';
      this.hist.push(this);
      return this.node[k];
    } else {
      this.col[2*k + 1] = 'yellow';
      this.hist.push(this);
      let vl = this._getsum(tl, tr, 2*k + 1, l, Math.floor((l+r)/2));

      this.col[2*k + 2] = 'yellow';
      this.hist.push(this);
      let vr = this._getsum(tl, tr, 2*k + 2, Math.floor((l+r)/2), r);
      return vl + vr;
    }
  };

  getsum(l, r) {
    this.col = new Array(2*this.n - 1).fill('white');
    this.col[0] = 'yellow';
    this.hist.clear();
    this.hist.push(this);
    return this._getsum(l, r, 0, 0, this.n);
  };

  get history() {
    return this.hist.data;
  }
}

function rmqFormatter(st, l, r) {
  const dat_with_col = st.node.map((d, i)=> Object({val: d, col: st.col[i]}));
  let ret = [];
  let sz = 0, n = 1;
  while (sz < st.node.length) {
    ret.push(dat_with_col.slice(sz, sz + n));
    sz += n;
    n *= 2;
  }

  let dat_idx = [];
  for (let i = 0; i < n/2; i++) {
    if (l !== undefined && r !== undefined && l <= i && i < r) {
      dat_idx.push({val: i, col: 'lightgray'});
    } else {
      dat_idx.push({val: i, col: 'gray'});
    }
  }
  ret.push(dat_idx);
  return ret;
}
