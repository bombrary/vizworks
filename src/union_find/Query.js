class Query{
  constructor(data) {
    this.data = data;
    this.cnt = 0;
  }
  next() { this.cnt++; }
  get hasNext() { return this.cnt < this.data.length; }
  get now() { return this.data[this.cnt]; }
};

