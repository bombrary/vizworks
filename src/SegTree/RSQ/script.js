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
const startTimer = () => {
  if (query_step === undefined || itr_step === undefined) return;
  itr_step = 0;
  query_timer = d3.interval((elapsed) => {
    if (itr_step === st.history.length - 1) query_timer.stop();
    iterateQuery();
  }, timer_interval);
}
startButton.on('click', startTimer);
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
    st.update(x-1, y); 
    queryName.text('update:');
    queryArgs.text(`a[${x-1}] = ${y}`);
    update(rmqFormatter(st.history[0]));
  } else if (c === 1) {
    let ans = st.getsum(x - 1, y); 
    queryName.text('getsum:');
    queryArgs.text(`[${x-1}, ${y}) => ${ans}`);
    update(rmqFormatter(st.history[0], x-1, y));
  }
  itr_step = 1;
  startTimer();
});


function iterateQuery() {
  let [c, x, y] = st_query[query_step];
  let l, r;
  if (c === 1) [l, r] = [x-1, y];
  update(rmqFormatter(st.history[itr_step], l, r));
  itr_step++;
}

const testcase =
"10 50\n" +
"0 4 12\n" +
"0 1 8\n" +
"1 7 7\n" +
"0 2 1\n" +
"0 6 8\n" +
"0 1 16\n" +
"0 3 17\n" +
"0 3 18\n" +
"1 4 10\n" +
"1 5 10\n" +
"0 8 40\n" +
"1 1 6\n" +
"1 1 3\n" +
"1 2 4\n" +
"1 7 7\n" +
"0 10 47\n" +
"0 2 40\n" +
"1 5 6\n" +
"0 1 27\n" +
"1 4 5\n" +
"1 1 10\n" +
"1 3 7\n" +
"1 1 4\n" +
"0 10 5\n" +
"0 10 27\n" +
"0 8 24\n" +
"1 7 10\n" +
"1 4 6\n" +
"0 7 9\n" +
"1 3 6\n" +
"0 9 1\n" +
"1 1 8\n" +
"0 7 13\n" +
"0 8 42\n" +
"1 3 9\n" +
"0 1 30\n" +
"1 2 2\n" +
"1 5 8\n" +
"0 6 38\n" +
"0 9 37\n" +
"0 8 13\n" +
"0 6 0\n" +
"1 3 4\n" +
"1 4 8\n" +
"0 1 40\n" +
"0 9 26\n" +
"0 8 8\n" +
"0 9 38\n" +
"0 4 38\n" +
"1 2 7";
testcaseButton.on('click', () => {
  textarea.property('value', testcase);
});
