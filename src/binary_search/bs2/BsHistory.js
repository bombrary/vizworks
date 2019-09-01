class BsHistory {
  constructor(extent, x) {
    this.extent = extent;
    this.data = [];
    this.formattedData = [];
    this.x = x;
  }
  push(l, r) {
    let mid = Math.floor((l + r) / 2);
    this.data.push({l, r, mid});
  }
}

class Iterator {
  constructor(bsHistory) {
    this.bsHistory = bsHistory;
    this.data = [];
    this.cnt = 0;
    const history = this.bsHistory.data[0];
    this.data.push(history);
  }
  next() {
    if (this.cnt < this.bsHistory.data.length - 1) {
      this.cnt++;
    }
    const history = this.bsHistory.data[this.cnt];
    this.data.push(history);
  }
  get now() {
    const extent = this.bsHistory.extent;
    const histories = this.data;
    const val = this.bsHistory.x;
    return {extent, histories, val};
  }
}
