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
  .style('height', height - 80);
const genButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'generate');
const itrButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'iterate');
const startButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'start');
const description = menu.append('p')
  .html("a1 a2 ... an <br> x")
const sum_info = menu.append('p')

let stack = [];
genButton.on('click', () => {
  const input = textarea.property('value')
    .split('\n')
    .map(d => d.split(' '))
    .map(d0 => d0.map(d1 => Number(d1)));
  stack.push(generate(input[0], input[1][0]));
})
  
itrButton.on('click', () => {
  // [selection, pointers, data, iterator, query]
  const ret = iterate(stack.pop());
  const pointers = ret[1];
  const itr_cnt= ret[3];
  update(ret[0], pointers[itr_cnt], ret[4]);
  if (itr_cnt === pointers.length - 1) ret[3] = 0;
  stack.push(ret);
});

startButton.on('click', () => {
  let t = d3.interval(() => {
    const ret = iterate(stack.pop());
    const pointers = ret[1];
    const itr_cnt= ret[3];
    update(ret[0], pointers[itr_cnt], ret[4]);
    if (itr_cnt === pointers.length - 1) {
      ret[3] = 0;
      t.stop();
    }
    stack.push(ret);
  }, 100);
});

function generate(data, x) {
  let pointers = [];
  let l = 0, r = 0, sum = 0
  pointers.push([l, r, 0]);
  for (l = 0; l < data.length; l++) {
    pointers.push([l, r, sum]);
    while (r < data.length && sum + data[r] <= x) {
      sum += data[r];
      r++;
      pointers.push([l, r, sum]);
    }
    if (r == l) r++;
    else sum -= data[l];
  }
  const div = main.append('div');
  const td = div.append('table')
    .append('tr')
    .selectAll('td')
    .data(data)
    .enter()
    .append('td')
    .text(d => d);
  const sum_info = div.append('p')
    .style('margin-left', 10)
    .html(`0 &le; ${x}`);
  // [selection, pointers, data, iterator, query]
  return [div, pointers, data, 0, x];
}

function iterate(data) {
  let [div, pointers, seq, itr_cnt, x] = data;
  if (itr_cnt < pointers.length) itr_cnt++;
  return [div, pointers, seq, itr_cnt, x];
}

function update(selection, pointer, x) {
  const [l, r, sum] = pointer;
  selection.selectAll('table td')
    .style('background-color', (d, i) => {
      if (l <= i && i < r) return 'lightgreen';
      else if (i === r) return 'orange';
      else return 'white';
    });
  selection.select('p')
    .style('margin-left', 10)
    .html(`${sum} &le; ${x}`);
}

// testcase:
//stack.push(generate('4,6,7,8,1,2,110,2,4,12,3,9'.split(',').map(d => Number(d)), 25));
const rand1 = d3.randomUniform(1, 51)
const rand2 = d3.randomUniform(50, 100)
const sample_arr = new Array(20).fill(0);
const sample_sum = Math.floor(rand2());
sample_arr.forEach((d,i,array) => { array[i] = Math.floor(rand1()); });
console.log(sample_sum);
stack.push(generate(sample_arr, sample_sum));

