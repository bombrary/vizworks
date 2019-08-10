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
});

let itr_step;
itrButton.on('click', () => {
  if (query_step === undefined || itr_step === undefined) return;
  if (itr_step === st.history.length) itr_step = 0;
  iterateQuery();
});

let query_timer;
const timer_interval = 50;
startButton.on('click', () => {
  if (query_step === undefined || itr_step === undefined) return;
  itr_step = 0;
  query_timer = d3.interval((elapsed) => {
    if (itr_step === st.history.length - 1) query_timer.stop();
    iterateQuery();
  }, timer_interval);
});
stopButton.on('click', () => {
  if (query_step === undefined || itr_step === undefined) return;
  query_timer.stop();
});

function iterateQuery() {
  let [c, x, y] = st_query[query_step];
  let l, r;
  if (c === 1) [l, r] = [x, y + 1];
  update(rmqFormatter(st.history[itr_step], l, r));
  itr_step++;
}
