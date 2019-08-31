const [width, height] = [800, 500];
const textarea_height = 350;
const body = d3.select('body');
const flexContainer = body.select('div.flex-container');
const menu = flexContainer.select('div.menu-container');
const main = flexContainer.select('div.main-container');
const textarea = menu.append('textarea')
  .style('height', textarea_height);
const dfsButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'dfs');
const bfsButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'bfs');
const ufButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'uf');
const itrButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'iterate');
const playButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'play');
const table = main.append('table');

let itr = null;
let td_width = 20;
// ========== DFS ========== 
dfsButton.on('click', () => {
  const input = inputFromTextarea();
  dfsGen(input);
});
function dfsGen(input) {
  itr = new HistoryIterator(solveHowManyIslands(input, dfs));
  update(itr.datum, td_width, itr.col);
}

// ========== BFS ========== 
bfsButton.on('click', () => {
  const input = inputFromTextarea();
  bfsGen(input);
});
function bfsGen(input) {
  itr = new HistoryIterator(solveHowManyIslands(input, bfs));
  update(itr.datum, td_width, itr.col);
}

// ========== UnionFind ========== 
ufButton.on('click', () => {
  const input = inputFromTextarea();
  ufGen(input);
});
function ufGen(input) {
  itr = new HistoryIterator(solveHowManyIslandsByUF(input, bfs));
  update(itr.datum, td_width, itr.col);
}

// ========== Formatter ========== 
function inputFromTextarea() {
  return formatForGen(textarea.property('value'));
}
function formatForGen(str) {
  return str.split('\n')
    .map(d => d.split(' '))
    .map(d0 => d0.map(d1 => Number(d1)));
}

// ========== iteration and auto play ========== 
itrButton.on('click', () => {
  update(itr.datum, td_width, itr.col);
  itr.next();
});
playButton.on('click', () => {
  if (itr === null) return;
  let t = d3.interval(() => {
    const flag = itr.next();
    if (!flag) {
      t.stop();
      return;
    }
    update(itr.datum, td_width, itr.col);
  }, 50);
});

// ========== Update ========== 
function update(data, td_width, col) {
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
    .style('width', td_width)
    .style('height', td_width)
    .style('background-color', d => col(d))
}

/* TestCase */

const testcase01 = '\
1 1 0 0 1 1 0 1 0 1 0\n\
1 1 1 0 0 0 0 0 0 1 1\n\
1 1 1 0 1 1 1 1 1 1 1\n\
1 1 0 0 1 1 1 1 0 1 1\n\
0 0 0 1 0 0 0 0 1 0 0\n\
1 1 1 0 1 0 1 1 1 1 1\n\
1 1 1 0 1 0 1 0 0 0 0\n\
1 1 1 0 1 0 1 1 1 0 1\n\
1 1 1 0 1 1 1 0 1 1 1\n\
0 0 0 1 0 0 0 0 0 0 0\n\
1 1 1 1 1 1 1 0 1 0 0';

const testcase02 = '\
1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n\
1 1 1 0 0 0 0 0 0 1 1 0 0 0 0 0 0\n\
1 1 1 0 1 1 1 1 0 1 1 0 0 0 0 0 0\n\
1 1 0 0 1 1 1 1 0 1 1 0 0 1 1 1 1\n\
0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0\n\
1 1 1 1 1 1 1 1 1 1 1 0 0 1 0 0 0\n\
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0\n\
1 1 1 1 1 1 1 1 1 1 1 0 0 1 0 0 0\n\
1 1 1 1 1 1 1 1 1 1 1 0 0 1 0 0 0\n\
0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 0 0\n\
1 1 0 0 1 1 1 1 0 1 1 0 1 0 0 0 0\n\
1 1 0 0 1 1 1 1 0 1 1 0 1 1 0 0 0\n\
1 1 0 0 1 1 1 1 0 1 1 0 0 1 0 0 0\n\
0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0\n\
0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0\n\
1 1 1 1 0 0 0 0 1 1 1 0 1 1 0 0 0\n\
1 1 1 0 1 1 0 0 1 1 1 1 1 1 1 0 0\n\
0 1 0 0 1 1 0 0 1 1 1 0 0 1 1 1 0\n\
0 0 0 0 0 0 0 0 1 1 1 0 0 0 1 1 0';


const selectTestCase = menu.append('select')
  .attr('id', 'select_test_case');
selectTestCase.append('option')
  .attr('value', 'testcase01')
  .text('testcase01');
selectTestCase.append('option')
  .attr('value', 'testcase02')
  .text('testcase02');

const testCaseButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'test case')
  .on('click', () => {
    const str = d3.select('select#select_test_case')
      .property('value');
    textarea.property('value', getTestcaseFromString(str));
  });

function getTestcaseFromString(str) {
  if (str === 'testcase01') return testcase01;
  else if (str === 'testcase02') return testcase02;
  else  return undefined;
}

const tdWidthForm = menu.append('form');
tdWidthForm.append('label')
  .attr('for', 'tdwidth')
  .text('width:');
tdWidthForm.append('input')
  .attr('type', 'number')
  .attr('name', 'tdwidth')
  .style('width', '100%')
  .property('value', 20)
  .on('change', function() {
    td_width = d3.select(this).property('value');
    if (itr !== null) update(itr.datum, td_width, itr.col);
  });
