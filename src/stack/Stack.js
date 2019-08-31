class Stack {
  constructor(capacity) {
    this.data = [...Array(capacity)];
    this.capacity = capacity;
    this.head = 0;
  }
  toArray() {
    return this.data.slice(0, this.head);
  }
  push(val) {
    if (this.head == this.capacity) {
      console.error('Stack is fulll.');
      return false;
    }
    this.data[this.head] = val;
    this.head++;
    this.log = 'pushed';
    return true;
  }
  front() {
    if (this.head == 0) {
      console.error('Stack is empty');
      return undefined;
    }
    return this.data[this.head - 1];
  }
  pop() {
    if (this.head == 0) {
      console.error('Stack is empty');
      return undefined;
    }
    this.head--;
    const val = this.data[this.head];
    this.data[this.head] = undefined;
    this.log = 'poped';
    return val;
  }
  get info() {
    return {
      data: this.data,
      capacity: this.capacity,
      head: this.head,
      log: this.log
    };
  }
};
