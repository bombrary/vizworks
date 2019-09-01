class BsHistory {
  constructor(rawData, x) {
    this.rawData = rawData;
    this.data = [];
    this.formattedData = [];
    this.x = x;
  }
  push(l, r) {
    let mid = Math.floor((l + r) / 2);
    this.data.push({l, r, mid});
  }
  formatData(datum) {
    const {l, r, mid} = datum;
    const x = this.x;
    return this.rawData.map((d, i) => {
      let col;
      if (i == mid) return {val: d, col: 'yellow'};
      else if (i < l || r < i) return {val: '', col: 'white'};
      else if (d <= x) return {val: d, col: 'lightgreen'};
      else return {val: d, col: 'orangered'};
    });
  }
}

class Iterator {
  constructor(history) {
    this.history = history;
    this.data = [];
    this.cnt = 0;
    const datum = this.history.data[0];
    this.data.push(this.history.formatData(datum));
  }
  next() {
    if (this.cnt < this.history.data.length - 1) {
      this.cnt++;
    }
    const datum = this.history.data[this.cnt];
    this.data.push(this.history.formatData(datum));
  }
  get now() {
    return this.data;
  }
}
