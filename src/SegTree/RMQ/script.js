const body = d3.select('body');
const article = body.select('article');
const menu = article.select('section.menu-left');
const main = article.select('section.content');
const textarea = menu.select('textarea')
const genButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'generate');
const nextQueryButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'next query');
const itrButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'step');
const startButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'start');
const stopButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'stop');
const testcaseButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'testcase');
const queryInfo = menu.append('div')
const queryName = queryInfo.append('p');
const queryArgs = queryInfo.append('p');
const tbody = main.append('table')
  .append('tbody')

// data[i][j] = {val, col};
function update(data) {
  // colspanの作成: e.g. 16,8,4,2,1,1, 最後が1になることに注目
  const colspan = [];
  let n = d3.max(data, d => d.length);
  while (n) {
    colspan.push(n)
    n /= 2;
  }
  colspan.push(1);

  const tr = tbody.selectAll('tr')
    .data(data.map((d, i) => Object({idx: i, val: d})));
  tr.exit().remove();
  const td = tr.enter()
    .append('tr')
    .merge(tr)
    .selectAll('td')
    .data(d => d.val);
  td.exit().remove();
  td.enter()
    .append('td')
    .merge(td)
    .attr('colspan', function (d, i) {
      let idx = d3.select(this.parentNode)
        .datum().idx;
      return colspan[idx];
    })
    .style('background-color', d => d.col)
    .merge(td)
    .text(d => d.val === Infinity ? 'INF' : d.val);
}

let st;
let st_query;
genButton.on('click', () => {
  query_step = -1;
  input = textarea.property('value')
    .split('\n')
    .map(d => d.split(' '))
    .map(d0 => d0.map(d1 => Number(d1)));
  st = new segtree(input[0][0]);
  st_query = input.slice(1, input[0][1]+1);
  update(rmqFormatter(st));
});


let itr_step;
itrButton.on('click', () => {
  if (query_step === undefined || itr_step === undefined) return;
  if (itr_step === st.history.length) itr_step = 0;
  iterateQuery();
});

let query_timer;
const timer_interval = 50;
const timerStart = () => {
  if (query_step === undefined || itr_step === undefined) return;
  itr_step = 0;
  query_timer = d3.interval((elapsed) => {
    if (itr_step === st.history.length - 1) query_timer.stop();
    iterateQuery();
  }, timer_interval);
};
startButton.on('click', timerStart);
stopButton.on('click', () => {
  if (query_step === undefined || itr_step === undefined) return;
  query_timer.stop();
});

let query_step;
nextQueryButton.on('click', () => {
  if (query_step === undefined) return;
  if (query_step === st_query.length - 1) return;
  query_step++;
  let [c, x, y] = st_query[query_step];
  if (c === 0) {
    st.update(x, y); 
    queryName.text('update:');
    queryArgs.text(`a[${x}] = ${y}`);
    update(rmqFormatter(st.history[0]));
  } else if (c === 1) {
    st.getmin(x, y + 1); 
    queryName.text('getmin:');
    queryArgs.text(`[${x}, ${y+1})`);
    update(rmqFormatter(st.history[0], x, y + 1));
  }
  itr_step = 1;
  timerStart();
});

function iterateQuery() {
  let [c, x, y] = st_query[query_step];
  let l, r;
  if (c === 1) [l, r] = [x, y + 1];
  update(rmqFormatter(st.history[itr_step], l, r));
  itr_step++;
}

const testcase = 
"10 50\n" +
"0 2 43\n" +
"0 8 0\n" +
"1 6 6\n" +
"0 1 11\n" +
"0 8 5\n" +
"0 6 30\n" +
"0 7 32\n" +
"0 8 22\n" +
"1 3 9\n" +
"1 4 9\n" +
"0 0 27\n" +
"1 0 5\n" +
"1 0 2\n" +
"1 1 3\n" +
"1 6 6\n" +
"0 7 29\n" +
"0 0 41\n" +
"1 4 5\n" +
"0 7 30\n" +
"1 3 4\n" +
"1 0 9\n" +
"1 2 6\n" +
"1 0 3\n" +
"0 5 19\n" +
"0 7 49\n" +
"0 4 47\n" +
"1 6 9\n" +
"1 3 5\n" +
"0 9 6\n" +
"1 2 5\n" +
"0 1 38\n" +
"1 0 7\n" +
"0 3 6\n" +
"0 2 27\n" +
"1 2 8\n" +
"0 0 10\n" +
"1 1 1\n" +
"1 4 7\n" +
"0 8 25\n" +
"0 7 18\n" +
"0 3 37\n" +
"0 0 45\n" +
"1 2 3\n" +
"1 3 7\n" +
"0 0 30\n" +
"0 6 28\n" +
"0 8 47\n" +
"0 8 38\n" +
"0 8 43\n" +
"1 1 6";

testcaseButton.on('click', () => {
  textarea.property('value', testcase);
});
