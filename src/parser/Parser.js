class Parser {
  constructor(str) {
    this.str = str;
  }
  execute() {
    this.i = 0;
    return this.expr();
  }
  expr() {
    const ret = {
      name: 'expr',
      children: []
    };
    const start = this.i;
    ret.children.push(this.term());
    while (true) {
      if (this.str[this.i] === '+' || this.str[this.i] === '-') {
        ret.children.push({
          name: 'atom',
          text: this.str[this.i],
          children: null,
        });
        this.i++;
        ret.children.push(this.term());
      } else {
        break;
      }
    }
    ret.text = this.str.slice(start, this.i);
    return ret;
  }
  term() {
    const ret = {
      name: 'term',
      children: []
    };
    const start = this.i;
    ret.children.push(this.fact());
    while (true) {
      if (this.str[this.i] === '*' || this.str[this.i] === '/') {
        ret.children.push({
          name: 'atom',
          text: this.str[this.i],
          children: null,
        });
        this.i++;
        ret.children.push(this.fact());
      } else {
        break;
      }
    }
    ret.text = this.str.slice(start, this.i);
    return ret;
  }
  fact() {
    const ret = {
      name: 'fact',
      children: []
    };
    const start = this.i;
    if (this.str[this.i] === '(') {
      ret.children.push({
        name: 'atom',
        text: this.str[this.i],
        children: null,
      });
      this.i++;
      ret.children.push(this.expr());
      ret.children.push({
        name: 'atom',
        text: this.str[this.i],
        children: null,
      });
      this.i++;
      ret.text = this.str.slice(start, this.i);
      return ret;
    } else {
      ret.children.push(this.number());
      ret.text = this.str.slice(start, this.i);
      return ret;
    }
  }
  number() {
    const ret = {
      name: 'number',
      children: null
    };
    const start = this.i;
    while (!isNaN(this.str[this.i])) {
      this.i++;
    }
    ret.text = this.str.slice(start, this.i);
    return ret;
  }
}
