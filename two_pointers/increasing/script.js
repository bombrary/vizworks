'use strict'
const [width, height] = [800, 500];
const body = d3.select('body');
const flexContainer = body.append('div')
  .attr('class', 'flex-container');
const menu = flexContainer.append('div')
  .attr('class', 'menu-container');
const main = flexContainer.append('div')
  .attr('class', 'main-container');
const textarea = menu.append('textarea')
  .style('height', height - 40);
const genButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'generate');
const itrButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'iterate');
const startButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'start');

let stack = [];
genButton.on('click', () => {
  const input = textarea.property('value')
    .split('\n')
    .map(d => d.split(' '))
    .map(d0 => d0.map(d1 => Number(d1)));
  stack.push(generate(input[0]));
})
  
itrButton.on('click', () => {
  const ret = iterate(stack.pop());
  const pointers = ret[1];
  const itr_cnt= ret[3];
  update(ret[0], pointers[itr_cnt]);
  if (itr_cnt === pointers.length - 1) ret[3] = 0;
  stack.push(ret);
});

startButton.on('click', () => {
  let t = d3.interval(() => {
    const ret = iterate(stack.pop());
    const pointers = ret[1];
    const itr_cnt= ret[3];
    update(ret[0], pointers[itr_cnt]);
    if (itr_cnt === pointers.length - 1) {
      ret[3] = 0;
      t.stop();
    }
    stack.push(ret);
  }, 100);
});

function generate(data) {
  let pointers = [];
  let l = 0, r = 0;
  pointers.push([l, r]);
  for (l = 0; l < data.length; l++) {
    pointers.push([l, r]);
    if (l == r) {
      r++;
      pointers.push([l, r]);
    }
    while (r < data.length && data[r-1] < data[r]) {
      r++;
      pointers.push([l, r]);
    }
  }
  const td = main.append('table')
    .append('tr')
    .selectAll('td')
    .data(data)
    .enter()
    .append('td')
    .text(d => d);
  return [td, pointers, data, 0];
}

function iterate(data) {
  let [td, pointers, seq, itr_cnt] = data;
  if (itr_cnt < pointers.length) itr_cnt++;
  return [td, pointers, seq, itr_cnt];
}

function update(selection, pointer) {
  const [l, r] = pointer;
  selection.style('background-color', (d, i) => {
      if (l <= i && i < r) return 'lightgreen';
      else if (i === r) return 'orange';
      else return 'white';
    });
}

// testcase:
stack.push(generate('1 2 3 4 5 1 2 3 4 3 2 1 2 3 1 1 3 5 8 1 2 1 2 1 2 3 4 5'.split(' ')));

