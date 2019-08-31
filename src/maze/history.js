class MazeHistory {
  constructor(mp) {
    this.data = [];
    this.pos = [];
    this.qdata = [];
    this.mp = mp;
  }
  push(data, queue, pos) {
    const cpdata = [];
    for (let i = 0; i < data.length; i++) {
      cpdata.push([]);
      for (let j = 0; j < data[i].length; j++) {
        cpdata[i].push(data[i][j]);
      }
    }
    this.data.push(cpdata);
    this.pos.push([pos[0], pos[1]]);
    this.qdata.push(queue.toArray());
  }
  getMapInQueue(qarr) {
    const ret = new Array(this.mp.length);
    for (let i = 0; i < this.mp.length; i++) {
      ret[i] = new Array(this.mp[i].length).fill(false);
    }
    for (const p of qarr) {
      ret[p[0]][p[1]] = true;
    }
    return ret;
  }
  getFormattedData(t) {
    const ret = [];
    const tdata = this.data[t];
    const tpos = this.pos[t];
    const inqueue = this.getMapInQueue(this.qdata[t]);

    for (let i = 0; i < tdata.length; i++) {
      ret.push([]);
      for (let j = 0; j < tdata[i].length; j++) {
        const text = tdata[i][j] === Infinity ? '&infin;' : tdata[i][j];
        let col;
        if (i === tpos[0] && j === tpos[1]) col = 'yellow';
        else if (this.mp[i][j] === '#') col = 'black';
        else if (tdata[i][j] === Infinity) col = 'lightgray';
        else if (inqueue[i][j]) col = 'lightgreen';
        else col = 'orangered';
        ret[i].push({text: text, col: col});
      }
    }
    return ret;
  }
}

class MazeHistoryIterator {
  constructor(history) {
    this.history = history;
    this.cnt = 0;
  }
  hasNext() {
    return this.cnt < this.history.data.length;
  }
  next() {
    this.cnt++;
  }
  reset() {
    this.cnt = 0;
  }
  now() {
    return this.history.getFormattedData(this.cnt);
  }
}
