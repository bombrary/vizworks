class binaryTreeArranger {
  constructor(radius, paddingRight, paddingBottom) {
    this.radius = radius;
    this.paddingRight = paddingRight;
    this.paddingBottom = paddingBottom;
  }
  arrange(data, dataSize) {
    const radius = this.radius;
    const paddingRight = this.paddingRight;
    const paddingBottom = this.paddingBottom;
    // len is power of two, easy to process.
    let len = 1;
    while (len <= data.length) len *= 2;
    let ret = [...Array(len-1)];
    // Create bottom position
    let pos = 0;
    for (let i = Math.floor((len - 1) / 2); i < len-1; i++) {
      ret[i] = { x: pos, y: 0 };
      if (data[i] !== undefined) {
        ret[i] = Object.assign(ret[i], data[i]);
      }
      pos += 2*radius + paddingRight;
    }
    // Create other position
    for (let i = Math.floor((len - 1) / 2) - 1; i >= 0; i--) {
      let xl = ret[2*i + 1].x;
      let xr = ret[2*i + 2].x;
      let y = ret[2*i + 1].y - paddingBottom;
      ret[i] = { x: (xl + xr) / 2, y: y };
      if (data[i] !== undefined) {
        ret[i] = Object.assign(ret[i], data[i]);
      }
    }

    const rootY = ret[0].y;
    ret = ret.slice(0, dataSize);
    // Assign parents
    for (let i = dataSize - 1; i > 0; i--) {
      ret[i].parent = ret[Math.floor((i - 1) / 2)];
    }
    return {rootY: rootY, radius: radius, data: ret };
  }
}
class HeapTree {
  constructor(heapCapacity, compare) {
    this.heapCapacity = heapCapacity;
    this.data = [...Array(heapCapacity)].fill(undefined);
    this.heapSize = 0;
    this.compare = compare;
    this.nodeId = 0;
    this.radius = 20;
    this.paddingRight = 30;
    this.paddingBottom = 100;
  }
  push(val) {
    const history = [];
    if (this.heapSize >= this.heapCapacity) {
      console.error('Tree is full; expand size.');
      return undefined;
    }
    let i = this.heapSize;
    this.heapSize++;
    let p = Math.floor((i - 1) / 2);
    this.data[i] = {
      val: val,
      id: this.nodeId++
    };
    history.push(this.toPosition());
    while (i > 0 && !this.compare(this.data[p].val, this.data[i].val)) {
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      history.push(this.toPosition());
      i = p;
      p = Math.floor((i - 1) / 2);
    }
    return history;
  }
  front() {
    if (this.heapSize == 0) return undefined;
    else return this.data[0].val;
  }
  pop() {
    const history = [];
    if (this.heapSize == 0) {
      console.error('Tree is empty.');
      return undefined;
    }

    this.heapSize--;
    const ret = this.data[0];
    this.data[0] = this.data[this.heapSize];
    history.push(this.toPosition());

    let i = 0, l = 1, r = 2;
    while (l < this.heapSize) {
      if (l === this.heapSize) {
        if (this.compare(this.data[l].val, this.data[i].val)) {
          [this.data[i], this.data[l]] = [this.data[l], this.data[i]];
          history.push(this.toPosition());
          i = l;
        } else {
          break;
        }
      } else {
        const idx = this.compare(this.data[l].val, this.data[r].val) ? l : r;
        if (this.compare(this.data[idx].val, this.data[i].val)) {
          [this.data[i], this.data[idx]] = [this.data[idx], this.data[i]];
          history.push(this.toPosition());
          i = idx;
        } else {
          break;
        }
      }
      [l, r] = [2*i + 1, 2*i + 2];
    }
    return history;
  }
  empty() {
    return this.heapSize === 0;
  }
  resize(heapCapacity) {
    let msg;
    if (this.heapCapacity < heapCapacity) {
      for (let i = 0; i < heapCapacity - this.heapCapacity; i++) {
        this.data.push(undefined);
      }
      msg = 'Expanded';
    } else {
      this.data = this.data.slice(0, heapCapacity);
      this.heapSize = Math.min(this.heapSize, heapCapacity);
      msg = 'Shrinked';
    }
    this.heapCapacity = heapCapacity;
    return msg;
  }

  toPosition() {
    return new binaryTreeArranger(this.radius, this.paddingRight, this.paddingBottom)
      .arrange(this.data, this.heapSize);
  }
}

