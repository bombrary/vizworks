"use strict"

const table = d3.select('.content')
  .append('table');

const update = (data) => {
  const tr = table.selectAll('tr')
    .data(data);
  tr.exit().remove();
  const td = tr.enter()
    .append('tr')
    .merge(tr)
    .selectAll('td')
    .data(d => d);
  td.exit().remove();
  td.enter()
    .append('td')
    .merge(td)
    .text(d => d.val)
    .style('background-color', d => d.col);
};


const binarySearch = (data, val) => {
  const ret = new BsHistory(data, val);
  let l = -1, r = data.length;
  let mid = Math.floor((r + l) / 2);
  ret.push(l, r, mid);
  while (r - l > 1) {
    mid = Math.floor((r + l) / 2);
    if (data[mid] <= val) l = mid;
    else r = mid;
    ret.push(l, r, mid);
  }
  return ret;
};

const putButton = (name) => d3.select('.menu-left')
    .append('input')
    .attr('type', 'button')
    .attr('value', name);

let itr;
putButton('generate')
  .on('click', () => {
    let randD = d3.randomUniform(0, 50);
    let rand10 = () => Math.floor(randD());

    let dat = [];
    let x = rand10();
    for (let i = 0; i < 30; i++) {
      let num = rand10();
      dat.push(num);
    }
    dat.sort((a, b) => (a - b));
    itr = new Iterator(binarySearch(dat, x));
    update(itr.now);
    d3.selectAll('.value')
      .text(x);
  });
putButton('iterate')
  .on('click', () => {
    itr.next();
    update(itr.now);
  });
