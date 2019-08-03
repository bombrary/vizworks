class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  push(x) {
    const node = new ListNode(x);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
  }
  pop() {
    const node = this.head.next;
    this.head.next = null; // 念のため参照先をnullにする
    this.head = node;
  }
  front() {
    return this.head.value;
  }
  toArray() {
    const ret = [];
    let cur = this.head;
    while (cur !== null) {
      ret.push(cur.value);
      cur = cur.next;
    }
    return ret;
  }
  empty() {
    return this.head === null;
  }
}
