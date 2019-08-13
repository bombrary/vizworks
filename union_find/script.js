const [svgWidth, svgHeight] = [800, 600];
const article = d3.select('body')
  .select('article');
const menu = article.select('section.menu-left');
const svg = article.select('section.content')
  .select('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
const textarea = menu.select('textarea');
const chargeStrengthP = menu.select('input#chargeStrength_number')
const linkDistanceP = menu.select('input#linkDistance_number')

const queryButton = menu.select('input#query_button');
const itrButton   = menu.select('input#itr_button');
const playButton  = menu.select('input#play_button');
const stopButton  = menu.select('input#stop_button');
const queryInfo = article.select('section.query-info')
  .append('ul');


const gEdit = new GraphEditor(svg, true);
gEdit.chargeStrength = -300;
gEdit.linkDistance = 150;
gEdit.initSimulation();
chargeStrengthP.attr('value', gEdit.chargeStrength)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.chargeStrength = Number(input);
    gEdit.initSimulation();
  });
linkDistanceP.attr('value', gEdit.linkDistance)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.linkDistance = Number(input);
    gEdit.initSimulation();
  });

let q;
let uf;

const updateQueryInfo = (data) => {
  const li = queryInfo.selectAll('li')
    .data(data);
  li.exit().remove();
  li.enter()
    .append('li')
    .merge(li)
    .text(d => d);
};
queryButton.on('click', () => {
  const input = textarea.property('value')
    .split('\n')
    .map(d => d.split(' '))
    .map(d0 => d0.map(d1 => Number(d1)));
  q = new Query(input.slice(1));
  uf = new UnionFind(input[0][0], gEdit);
  updateQueryInfo(q.data);
});
itrButton.on('click', () => {
  if (q.hasNext) {
    let [c, x, y] = q.now;
    q.next();
    if (c === 0) uf.unite(x, y);
    else console.log(uf.same(x, y));
    updateQueryInfo(q.data.slice(q.cnt));
  }
});
playButton.on('click', () => {
  playButton.property('disabled', true);
  const t = d3.interval(() => {
    if (q.hasNext) {
      let [c, x, y] = q.now;
      q.next();
      if (c === 0) uf.unite(x, y);
      else console.log(uf.same(x, y));
      updateQueryInfo(q.data.slice(q.cnt));
    } else {
      playButton.property('disabled', false);
      t.stop();
    }
  }, 500);
});

const testcase01 = 
"36\n" +
"1 34 12\n" +
"1 2 14\n" +
"0 9 8\n" +
"1 5 31\n" +
"0 28 29\n" +
"0 27 28\n" +
"1 28 25\n" +
"0 25 31\n" +
"0 2 1\n" +
"0 35 34\n" +
"1 24 21\n" +
"0 16 17\n" +
"0 34 35\n" +
"0 28 22\n" +
"0 13 14\n" +
"1 31 34\n" +
"0 0 1\n" +
"1 18 13\n" +
"1 12 19\n" +
"0 10 11\n" +
"0 31 30\n" +
"1 15 26\n" +
"0 25 19\n" +
"0 28 29\n" +
"0 29 23\n" +
"0 22 16\n" +
"0 25 31\n" +
"0 11 17\n" +
"1 35 34\n" +
"0 16 10\n" +
"0 34 35\n" +
"1 29 26\n" +
"0 8 2\n" +
"1 12 34\n" +
"1 18 4\n" +
"0 7 6\n" +
"1 21 13\n" +
"0 9 10\n" +
"0 34 33\n" +
"1 31 23\n" +
"1 27 31\n" +
"0 6 12\n" +
"1 6 12\n" +
"0 20 21\n" +
"0 2 8\n" +
"1 34 28\n" +
"0 4 10\n" +
"1 24 32\n" +
"1 18 20\n" +
"0 23 22\n" +
"1 2 14\n" +
"1 31 2\n" +
"1 27 26\n" +
"0 12 13\n" +
"0 25 24\n" +
"0 0 6\n" +
"0 31 32\n" +
"1 8 29\n" +
"1 16 11\n" +
"1 4 30\n" +
"1 5 13\n" +
"0 14 8\n" +
"0 29 23\n" +
"0 15 9\n" +
"1 26 25\n" +
"0 32 33\n" +
"0 13 19\n" +
"0 22 28\n" +
"0 28 34\n" +
"0 6 0\n" +
"1 33 32\n" +
"0 13 14\n" +
"0 30 24\n" +
"1 14 29\n" +
"1 30 2\n" +
"1 28 27\n" +
"1 35 15\n" +
"0 30 31\n" +
"1 20 29\n" +
"1 24 14\n" +
"0 26 20\n" +
"0 35 29\n" +
"1 14 8\n" +
"1 27 19\n" +
"0 17 23\n" +
"1 14 34\n" +
"0 32 26\n" +
"1 28 12\n" +
"0 18 24\n" +
"1 25 4\n" +
"0 27 26\n" +
"1 3 21\n" +
"0 25 19\n" +
"1 19 24\n" +
"0 33 32\n" +
"0 15 21\n" +
"1 34 17\n" +
"0 26 20\n" +
"0 12 13\n" +
"1 22 21";
textarea.property('value', testcase01);
