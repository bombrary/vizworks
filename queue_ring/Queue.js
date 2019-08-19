class Queue {
  constructor(queueCapacity) {
    this.queueCapacity = queueCapacity;
    this.queueSize = 0;
    this.head = 0;
    this.tail = 0;
    this.data = [...Array(queueCapacity)].fill(undefined);
  }
  push(val) {
    if (this.queueSize == this.queueCapacity) {
      throw new Error('Queue is full.');
    }
    this.data[this.tail] = val;
    this.tail = (this.tail + 1) % this.queueCapacity;
    this.queueSize++;
  }
  get front() {
    if (this.queueSize == 0) {
      throw new Error('Queue is empty.');
      return undefined;
    }
    return this.data[this.head];
  }
  pop() {
    if (this.queueSize == 0) {
      throw new Error('Queue is empty.');
    }
    const val = this.data[this.head];
    this.data[this.head] = undefined;
    this.head = (this.head + 1) % this.queueCapacity;
    this.queueSize--;
    return val;
  }
  get queueInfo() {
    return {
      data: this.data,
      head: this.head,
      tail: this.tail,
      size: this.queueSize,
      capacity: this.queueCapacity
    };
  }
  
  get size() {
    return this.queueSize;
  }
}
