class History {
  constructor(col) {
    this.data = [];
    this.col = col
  }
  push(map, pos) {
    if (pos[0] >= 0 && pos[1] >= 0) {
      map[pos[0]][pos[1]] = 3;
    }
    this.data.push(map);
  }
  datum(i) {
    return this.data[i]; 
  }
  get length() {
    return this.data.length;
  }
}

class HistoryIterator {
  constructor(history) {
    this.data = history;
    this.cur = 0;
  }
  next() {
    if (this.data.length == 0) return;
    this.cur = (this.cur + 1) % this.data.length;
    if (this.cur % this.data.length > 0) return true;
    else return false;
  }
  get datum() {
    return this.data.datum(this.cur);
  }
  get map() {
    return this.data.datum(this.cur).map;
  }
  get col() {
    return this.data.col;
  }
}

